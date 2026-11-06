const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "divaa_hotel_db", // iisang database para sa lahat ng routes
  dateStrings: true,
});

// Database row
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
  status: r.status || "Pending",
});

// READ
app.get("/api/reservations", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM reservations ORDER BY check_in DESC",
    );
    res.json(rows.map(toClient));
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post("/api/reservations", async (req, res) => {
  try {
    const b = req.body;
    await db.query(
      `INSERT INTO reservations
       (id, guest_name, email, phone, room_type, guests, check_in, check_out,
        nights, total_amount, payment_method, notes, status)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        b.id,
        b.guestName,
        b.email,
        b.phone,
        b.roomType,
        b.guests || 1,
        b.checkIn,
        b.checkOut,
        b.nights || 0,
        b.totalAmount || 0,
        b.paymentMethod || "Cash",
        b.notes || null,
        b.status || "Pending",
      ],
    );
    console.log("CREATED", b.id);
    res.status(201).json({ ok: true, id: b.id });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/reservations/:id", async (req, res) => {
  try {
    const b = req.body;
    const [result] = await db.query(
      `UPDATE reservations SET
        guest_name     = COALESCE(?, guest_name),
        email          = COALESCE(?, email),
        phone          = COALESCE(?, phone),
        room_type      = COALESCE(?, room_type),
        guests         = COALESCE(?, guests),
        check_in       = COALESCE(?, check_in),
        check_out      = COALESCE(?, check_out),
        nights         = COALESCE(?, nights),
        total_amount   = COALESCE(?, total_amount),
        payment_method = COALESCE(?, payment_method),
        status         = COALESCE(?, status)
       WHERE id = ?`,
      [
        b.guestName ?? null,
        b.email ?? null,
        b.phone ?? null,
        b.roomType ?? null,
        b.guests ?? null,
        b.checkIn ?? null,
        b.checkOut ?? null,
        b.nights ?? null,
        b.totalAmount ?? null,
        b.paymentMethod ?? null,
        b.status ?? null,
        req.params.id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    console.log("UPDATED", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM reservations WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    console.log("DELETED", req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log("API running on http://localhost:8080"));
