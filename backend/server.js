const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let reservations = [];

app.post("/api/users/sync", async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;
    res.json({ ok: true, message: "User synced successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/reservations", async (req, res) => {
  try {
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reservations", async (req, res) => {
  try {
    const b = req.body;
    const newReservation = {
      id: b.id || "RES-" + Date.now().toString().slice(-6),
      guestName: b.guestName || "",
      email: b.email || "",
      phone: b.phone || "",
      roomType: b.roomType || "Standard Room",
      guests: Number(b.guests) || 1,
      checkIn: b.checkIn || "",
      checkOut: b.checkOut || "",
      nights: Number(b.nights) || 1,
      totalAmount: Number(b.totalAmount) || 0,
      paymentMethod: b.paymentMethod || "Cash",
      notes: b.notes || "",
      status: b.status || "Pending",
    };
    reservations.unshift(newReservation);
    res.status(201).json({ ok: true, id: newReservation.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    reservations[index] = {
      ...reservations[index],
      ...req.body,
    };
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const initialLength = reservations.length;
    reservations = reservations.filter((r) => r.id !== id);
    if (reservations.length === initialLength) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8080, () => console.log("API running on http://localhost:8080"));
