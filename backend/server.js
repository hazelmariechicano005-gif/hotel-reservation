const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// DIRECT DATABASE CONNECTION (XAMPP MySQL)
// ==========================================
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "", // Default XAMPP password ay walang laman
    database: "divaa_hotel_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

// ==========================================
// USERS API (Sign-in & Register)
// ==========================================
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password." });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
      [username, password],
    );
    res
      .status(201)
      .json({
        ok: true,
        userId: result.insertId,
        message: "User registered successfully!",
      });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username already exists." });
    }
    res.status(500).json({ message: "Failed to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password." });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    const user = rows[0];
    res.json({
      ok: true,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed." });
  }
});

// ==========================================
// ROOMS API
// ==========================================
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

// ==========================================
// RESERVATIONS API
// ==========================================
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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
