const express = require("express");
const cors = require("cors");

let mysql;
try {
  mysql = require("mysql2");
} catch (err) {
  mysql = require("mysql");
}

const app = express();

app.use(cors());
app.use(express.json());

const rawPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "divaa_hotel_db",
  waitForConnections: true,
  connectionLimit: 10,
});

const pool = {
  query: (sql, params = []) =>
    new Promise((resolve, reject) => {
      rawPool.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    }),
};

const reservationColumns = {
  guest_name: "VARCHAR(100) NULL",
  email: "VARCHAR(100) NULL",
  phone: "VARCHAR(30) NULL",
  room_type: "VARCHAR(100) NULL",
  guests: "INT NULL DEFAULT 1",
  check_in: "DATE NULL",
  check_out: "DATE NULL",
  nights: "INT NULL DEFAULT 1",
  total_amount: "INT NULL DEFAULT 0",
  payment_method: "VARCHAR(30) NULL",
  notes: "TEXT NULL",
  status: "VARCHAR(30) NULL DEFAULT 'Pending'",
  user_id: "VARCHAR(128) NULL",
  created_at: "TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP",
};

const userColumns = {
  uid: "VARCHAR(128) NULL",
  name: "VARCHAR(100) NULL",
  email: "VARCHAR(100) NULL",
  role: "VARCHAR(20) NOT NULL DEFAULT 'customer'",
  photo_url: "TEXT NULL",
  created_at: "TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP",
  last_login: "TIMESTAMP NULL DEFAULT NULL",
};

async function columnInfo(table, column) {
  const [rows] = await pool.query(
    `SELECT DATA_TYPE AS dataType FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return rows[0];
}

async function addColumnIfMissing(table, column, definition) {
  if (!(await columnInfo(table, column))) {
    await pool.query(
      `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
    );
  }
}

async function relaxOtherColumns(table, supplied) {
  const [rows] = await pool.query(
    `SELECT COLUMN_NAME AS name, COLUMN_TYPE AS type FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND IS_NULLABLE = 'NO'
     AND COLUMN_DEFAULT IS NULL AND COLUMN_KEY <> 'PRI'
     AND EXTRA NOT LIKE '%auto_increment%'`,
    [table],
  );
  for (const row of rows) {
    if (!supplied.includes(row.name)) {
      await pool.query(
        `ALTER TABLE \`${table}\` MODIFY \`${row.name}\` ${row.type} NULL`,
      );
    }
  }
}

async function ensureSchema() {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS reservations (id VARCHAR(20) NOT NULL PRIMARY KEY)",
  );
  const idInfo = await columnInfo("reservations", "id");
  if (!idInfo) {
    await pool.query(
      "ALTER TABLE reservations ADD COLUMN id VARCHAR(20) NULL, ADD UNIQUE KEY uq_reservation_id (id)",
    );
  } else if (idInfo.dataType !== "varchar") {
    await pool.query("ALTER TABLE reservations MODIFY id VARCHAR(20) NOT NULL");
  }
  for (const [column, definition] of Object.entries(reservationColumns)) {
    await addColumnIfMissing("reservations", column, definition);
  }
  await relaxOtherColumns("reservations", [
    "id",
    ...Object.keys(reservationColumns),
  ]);

  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY)",
  );
  for (const [column, definition] of Object.entries(userColumns)) {
    await addColumnIfMissing("users", column, definition);
  }
  const roleInfo = await columnInfo("users", "role");
  if (roleInfo && roleInfo.dataType === "enum") {
    await pool.query(
      "ALTER TABLE users MODIFY role VARCHAR(20) NOT NULL DEFAULT 'customer'",
    );
  }
  await relaxOtherColumns("users", Object.keys(userColumns));
}

app.post("/api/users/sync", async (req, res) => {
  const { uid, name, email, photoURL, role } = req.body;
  if (!uid) {
    return res.status(400).json({ message: "uid is required." });
  }
  const safeRole = role === "admin" ? "admin" : "customer";
  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE uid = ? LIMIT 1",
      [uid],
    );
    if (existing.length > 0) {
      await pool.query(
        "UPDATE users SET name = ?, email = ?, role = ?, photo_url = ?, last_login = ? WHERE uid = ?",
        [name || "", email || "", safeRole, photoURL || null, new Date(), uid],
      );
    } else {
      await pool.query(
        `INSERT INTO users (uid, name, email, role, photo_url, created_at, last_login)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uid,
          name || "",
          email || "",
          safeRole,
          photoURL || null,
          new Date(),
          new Date(),
        ],
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save user." });
  }
});

app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, room_name AS room, price FROM rooms ORDER BY id DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load rooms from database." });
  }
});

app.post("/api/rooms", async (req, res) => {
  const { room, price } = req.body;
  if (!room || price === undefined || price === "" || Number(price) < 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid room and price." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO rooms (room_name, price) VALUES (?, ?)",
      [room, Number(price)],
    );
    res.status(201).json({ id: result.insertId, room, price: Number(price) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save room to database." });
  }
});

app.put("/api/rooms/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { room, price } = req.body;
  if (!room || price === undefined || price === "" || Number(price) < 0) {
    return res
      .status(400)
      .json({ message: "Please provide a valid room and price." });
  }
  try {
    const [result] = await pool.query(
      "UPDATE rooms SET room_name = ?, price = ? WHERE id = ?",
      [room, Number(price), id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.json({ id, room, price: Number(price) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update room." });
  }
});

app.delete("/api/rooms/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.json({ message: "Room deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete room." });
  }
});

const fields = {
  guestName: "guest_name",
  email: "email",
  phone: "phone",
  roomType: "room_type",
  guests: "guests",
  checkIn: "check_in",
  checkOut: "check_out",
  nights: "nights",
  totalAmount: "total_amount",
  paymentMethod: "payment_method",
  notes: "notes",
  status: "status",
  userId: "user_id",
};

const isoDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const newReservationId = () => "RES-" + Date.now().toString().slice(-6);

async function insertReservation(body) {
  const data = {
    id: body.id || newReservationId(),
    guest_name: body.guestName || "",
    email: body.email || "",
    phone: body.phone || "",
    room_type: body.roomType || body.room || "",
    guests: body.guests || 1,
    check_in: body.checkIn || isoDate(0),
    check_out: body.checkOut || isoDate(1),
    nights: body.nights || 1,
    total_amount: Number(body.totalAmount ?? body.price ?? 0),
    payment_method: body.paymentMethod || null,
    notes: body.notes || null,
    status: body.status || "Pending",
    user_id: body.userId || null,
    created_at: new Date(),
  };

  const cols = Object.keys(data);
  const marks = cols.map(() => "?").join(",");
  await pool.query(
    `INSERT INTO reservations (${cols.join(",")}) VALUES (${marks})`,
    Object.values(data),
  );
  return data.id;
}

app.get("/api/reservations", async (req, res) => {
  try {
    let sql = `SELECT id, guest_name AS guestName, email, phone,
      room_type AS roomType, guests,
      DATE_FORMAT(check_in, '%Y-%m-%d') AS checkIn,
      DATE_FORMAT(check_out, '%Y-%m-%d') AS checkOut,
      nights, total_amount AS totalAmount,
      payment_method AS paymentMethod, notes, status,
      user_id AS userId, created_at AS createdAt
      FROM reservations`;
    const params = [];
    if (req.query.userId) {
      sql += " WHERE user_id = ?";
      params.push(req.query.userId);
    }
    const [rows] = await pool.query(sql + " ORDER BY created_at DESC", params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reservations." });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const id = await insertReservation(req.body);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save reservation." });
  }
});

app.post("/api/reserve", async (req, res) => {
  const { room, roomType } = req.body;
  if (!room && !roomType) {
    return res.status(400).json({ message: "Please provide a room." });
  }
  try {
    const id = await insertReservation(req.body);
    res.status(201).json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save reservation." });
  }
});

app.put("/api/reservations/:id", async (req, res) => {
  try {
    const sets = [];
    const vals = [];
    for (const [key, col] of Object.entries(fields)) {
      if (req.body[key] !== undefined) {
        sets.push(`${col} = ?`);
        vals.push(req.body[key]);
      }
    }
    if (sets.length === 0) {
      return res.status(400).json({ message: "Nothing to update." });
    }
    vals.push(req.params.id);
    const [result] = await pool.query(
      `UPDATE reservations SET ${sets.join(",")} WHERE id = ?`,
      vals,
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update reservation." });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM reservations WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reservation." });
  }
});

const PORT = process.env.PORT || 8080;

ensureSchema()
  .then(() => {
    console.log("MySQL connected: tables ready");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database setup failed:", err.message);
    process.exit(1);
  });
