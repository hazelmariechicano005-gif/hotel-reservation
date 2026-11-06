require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  dateStrings: true, // dates come back as "YYYY-MM-DD"
  waitForConnections: true,
  connectionLimit: 10,
  // Uncomment for cloud DBs (Aiven, TiDB, etc.):
  // ssl: { rejectUnauthorized: true },
});

// Create the table automatically if it doesn't exist yet
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id VARCHAR(20) PRIMARY KEY,
      guest_name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(30),
      room_type VARCHAR(60),
      guests INT DEFAULT 1,
      check_in DATE,
      check_out DATE,
      nights INT DEFAULT 1,
      total_amount DECIMAL(10,2) DEFAULT 0,
      payment_method VARCHAR(30),
      notes TEXT,
      status VARCHAR(30) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database connected, reservations table ready.");
}

// DB row -> shape used by the frontend
const toClient = (r) => ({
  id: r.id,
  guestName: r.guest_name,
  email: r.email,
  phone: r.phone,
  roomType: r.room_type,
  guests: r.guests,
  checkIn: r.check_in,
  checkOut: r.check_out,
  nights: r.nights,
  totalAmount: Number(r.total_amount),
  paymentMethod: r.payment_method,
  notes: r.notes,
  status: r.status,
  createdAt: r.created_at,
});

app.get("/", (req, res) => res.send("API is running"));

app.post("/api/users/sync", (req, res) => {
  res.json({ ok: true, message: "User synced successfully!" });
});

app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM reservations ORDER BY created_at DESC",
    );
    res.json(rows.map(toClient));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || "RES-" + Date.now().toString().slice(-6);
    await pool.query(
      `INSERT INTO reservations
        (id, guest_name, email, phone, room_type, guests, check_in, check_out,
         nights, total_amount, payment_method, notes, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        id,
        b.guestName || "",
        b.email || "",
        b.phone || "",
        b.roomType || "Standard Room",
        Number(b.guests) || 1,
        b.checkIn || null,
        b.checkOut || null,
        Number(b.nights) || 1,
        Number(b.totalAmount) || 0,
        b.paymentMethod || "Cash",
        b.notes || "",
        b.status || "Pending",
      ],
    );
    res.status(201).json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/reservations/:id", async (req, res) => {
  try {
    const b = req.body;
    const [result] = await pool.query(
      `UPDATE reservations SET
         guest_name = ?, email = ?, phone = ?, room_type = ?,
         check_in = ?, check_out = ?, total_amount = ?, status = ?
       WHERE id = ?`,
      [
        b.guestName || "",
        b.email || "",
        b.phone || "",
        b.roomType || "Standard Room",
        b.checkIn || null,
        b.checkOut || null,
        Number(b.totalAmount) || 0,
        b.status || "Pending",
        req.params.id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM reservations WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;

initDb()
  .then(() =>
    app.listen(PORT, () => console.log(`API running on port ${PORT}`)),
  )
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
