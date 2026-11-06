import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api/reservations";

const ROOMS = [
  { name: "Economy Fan Room", price: 800, qty: 4 },
  { name: "Solo Room", price: 1000, qty: 4 },
  { name: "Standard Room", price: 1200, qty: 8 },
  { name: "Twin Room", price: 1400, qty: 4 },
  { name: "Deluxe Queen Room", price: 1600, qty: 8 },
  { name: "Triple Room", price: 2000, qty: 3 },
  { name: "Family Suite Room", price: 2400, qty: 8 },
  { name: "Honeymoon Suite", price: 2800, qty: 2 },
  { name: "Barkada Group Room", price: 3200, qty: 6 },
  { name: "Executive Suite", price: 3800, qty: 2 },
  { name: "Rooftop Penthouse", price: 4500, qty: 1 },
];
const TOTAL_ROOMS = ROOMS.reduce((s, r) => s + r.qty, 0);
const PAYMENTS = ["GCash", "Cash", "Bank Transfer", "Credit/Debit Card"];

const pick = (r, ...keys) => {
  for (const k of keys) if (r[k] !== undefined && r[k] !== null) return r[k];
  return "";
};

const pad = (n) => String(n).padStart(2, "0");

const toDate = (v) => {
  if (!v) return "";
  if (v instanceof Date) {
    return `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}`;
  }
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d)) return s.slice(0, 10);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const todayStr = () => toDate(new Date());

const addDays = (dateStr, days) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDate(d);
};

const diffNights = (a, b) => {
  if (!a || !b) return 0;
  const n = Math.round(
    (new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000,
  );
  return n > 0 ? n : 0;
};

const money = (n) => "₱" + Number(n || 0).toLocaleString();

const normalizeReservation = (r) => ({
  id: String(pick(r, "id", "reservation_id", "reservationId", "_id")),
  guestName: pick(r, "guestName", "guest_name", "name"),
  email: pick(r, "email"),
  phone: pick(r, "phone", "contact", "contact_number"),
  roomType: pick(r, "roomType", "room_type", "room"),
  guests: Number(pick(r, "guests", "guest_count")) || 1,
  checkIn: toDate(pick(r, "checkIn", "check_in", "checkin")),
  checkOut: toDate(pick(r, "checkOut", "check_out", "checkout")),
  nights:
    Number(pick(r, "nights")) ||
    diffNights(
      toDate(pick(r, "checkIn", "check_in", "checkin")),
      toDate(pick(r, "checkOut", "check_out", "checkout")),
    ),
  totalAmount: Number(pick(r, "totalAmount", "total_amount", "total")) || 0,
  paymentMethod: pick(r, "paymentMethod", "payment_method") || "Cash",
  notes: pick(r, "notes"),
  status: pick(r, "status") || "Pending",
});

const emptyForm = {
  guestName: "",
  email: "",
  phone: "",
  roomType: "Standard Room",
  guests: 1,
  checkIn: "",
  checkOut: "",
  nights: 0,
  totalAmount: 0,
  paymentMethod: "Cash",
  status: "Pending",
};

const card = {
  backgroundColor: "#ffffff",
  padding: "24px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  border: "1px solid #eef2f5",
};

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid #dcdfe4",
  boxSizing: "border-box",
  marginTop: "4px",
  fontSize: "0.9rem",
  backgroundColor: "#fff",
  color: "#333",
};

const labelStyle = { fontSize: "0.82rem", fontWeight: "600", color: "#444" };

const statusColor = (s) =>
  s === "Confirmed" ? "#2e7d32" : s === "Cancelled" ? "#b22222" : "#d97706";

function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: "12px", ...style }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function BookingModal({
  title,
  submitLabel,
  form,
  onChange,
  onSubmit,
  onClose,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "28px",
          borderRadius: "10px",
          width: "460px",
          maxWidth: "94%",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#2f4f4f",
            fontSize: "1.15rem",
            fontWeight: "700",
          }}
        >
          {title}
        </h3>
        <form onSubmit={onSubmit}>
          <Field label="Guest Name:">
            <input
              style={inputStyle}
              type="text"
              name="guestName"
              required
              value={form.guestName}
              onChange={onChange}
            />
          </Field>
          <Field label="Email:">
            <input
              style={inputStyle}
              type="email"
              name="email"
              required
              value={form.email}
              onChange={onChange}
            />
          </Field>
          <Field label="Phone:">
            <input
              style={inputStyle}
              type="text"
              name="phone"
              required
              value={form.phone}
              onChange={onChange}
            />
          </Field>

          <div style={{ display: "flex", gap: "10px" }}>
            <Field label="Room Type:" style={{ flex: 2 }}>
              <select
                style={inputStyle}
                name="roomType"
                value={form.roomType}
                onChange={onChange}
              >
                {ROOMS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({money(r.price)})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Guests:" style={{ flex: 1 }}>
              <input
                style={inputStyle}
                type="number"
                name="guests"
                min="1"
                required
                value={form.guests}
                onChange={onChange}
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Field label="Check-In:" style={{ flex: 1 }}>
              <input
                style={inputStyle}
                type="date"
                name="checkIn"
                required
                value={form.checkIn}
                onChange={onChange}
              />
            </Field>
            <Field label="Check-Out:" style={{ flex: 1 }}>
              <input
                style={inputStyle}
                type="date"
                name="checkOut"
                required
                min={form.checkIn ? addDays(form.checkIn, 1) : undefined}
                value={form.checkOut}
                onChange={onChange}
              />
            </Field>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Field label="Payment:" style={{ flex: 1 }}>
              <select
                style={inputStyle}
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={onChange}
              >
                {PAYMENTS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status:" style={{ flex: 1 }}>
              <select
                style={inputStyle}
                name="status"
                value={form.status}
                onChange={onChange}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </Field>
          </div>

          <Field label={`Amount (₱) — ${form.nights || 0} night(s):`}>
            <input
              style={inputStyle}
              type="number"
              name="totalAmount"
              min="0"
              required
              value={form.totalAmount}
              onChange={onChange}
            />
          </Field>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                border: "1px solid #dcdfe4",
                backgroundColor: "#fff",
                color: "#333",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: "#2f4f4f",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [lastLoaded, setLastLoaded] = useState("");
  const [arrivalsTab, setArrivalsTab] = useState("Arrivals");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const loadReservations = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      console.log("GET /api/reservations ->", data);
      const list = Array.isArray(data)
        ? data
        : data.data || data.rows || data.reservations || [];
      setReservations(list.map(normalizeReservation));
      setLastLoaded(new Date().toLocaleTimeString());
      setLoadError("");
    } catch (err) {
      console.error("Failed to load reservations:", err);
      setLoadError(
        `Hindi ma-load ang reservations mula sa ${API} (${err.message}). Siguraduhing buhay ang server sa port 8080.`,
      );
    }
  }, []);

  useEffect(() => {
    loadReservations();
    const timer = setInterval(loadReservations, 10000); // auto-refresh every 10s
    return () => clearInterval(timer);
  }, [loadReservations]);

  const sendJson = (url, method, data) =>
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "guests") next.guests = Number(value);
      if (name === "checkIn" && next.checkOut && next.checkOut <= value) {
        next.checkOut = "";
      }
      if (["roomType", "checkIn", "checkOut"].includes(name)) {
        const room = ROOMS.find((r) => r.name === next.roomType) || ROOMS[0];
        next.nights = diffNights(next.checkIn, next.checkOut);
        if (next.nights > 0) next.totalAmount = next.nights * room.price;
      }
      return next;
    });
  };

  const buildPayload = (f) => ({
    guestName: f.guestName,
    email: f.email,
    phone: f.phone,
    roomType: f.roomType,
    guests: Number(f.guests) || 1,
    checkIn: f.checkIn,
    checkOut: f.checkOut,
    nights: diffNights(f.checkIn, f.checkOut),
    totalAmount: Number(f.totalAmount) || 0,
    paymentMethod: f.paymentMethod,
    status: f.status,
  });

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await sendJson(API, "POST", {
        id: "RES-" + Date.now().toString().slice(-6),
        ...buildPayload(formData),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      await loadReservations();
      setIsAddModalOpen(false);
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Hindi na-save ang booking. Subukan ulit.");
    }
  };

  const handleOpenEdit = (r) => {
    setEditingId(r.id);
    setFormData({ ...emptyForm, ...r });
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      const res = await sendJson(
        `${API}/${editingId}`,
        "PUT",
        buildPayload(formData),
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      await loadReservations();
      setIsEditModalOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      alert("Hindi na-update ang booking. Subukan ulit.");
    }
  };

  const handleStatusQuickChange = async (id, newStatus) => {
    try {
      const current = reservations.find((r) => r.id === id);
      if (!current) return;
      const res = await sendJson(
        `${API}/${id}`,
        "PUT",
        buildPayload({ ...current, status: newStatus }),
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      await loadReservations();
    } catch (err) {
      console.error(err);
      alert("Hindi na-update ang status.");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (
      window.confirm(
        "Sigurado ka bang gusto mong burahin ang reservation na ito?",
      )
    ) {
      try {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        await loadReservations();
      } catch (err) {
        console.error(err);
        alert("Hindi nabura sa database. Tingnan ang server terminal.");
      }
    }
  };

  const today = todayStr();
  const active = reservations.filter((r) => r.status !== "Cancelled");
  const staying = (r) => r.checkIn <= today && today < r.checkOut;

  const totalBooked = reservations.filter(
    (r) => r.status === "Confirmed",
  ).length;
  const totalPending = reservations.filter(
    (r) => r.status === "Pending",
  ).length;
  const occupiedToday = active.filter(staying).length;
  const availableRoomsCount = Math.max(0, TOTAL_ROOMS - occupiedToday);

  const availableByType = ROOMS.map((room) => ({
    name: room.name,
    count: Math.max(
      0,
      room.qty -
        active.filter((r) => r.roomType === room.name && staying(r)).length,
    ),
  }));

  const arrivals = active
    .filter((r) => r.checkIn >= today)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const departures = active
    .filter((r) => r.checkOut >= today)
    .sort((a, b) => a.checkOut.localeCompare(b.checkOut));
  const listToShow = arrivalsTab === "Arrivals" ? arrivals : departures;

  const filteredReservations = reservations
    .filter((r) => filterStatus === "All" || r.status === filterStatus)
    .filter((r) => {
      const q = searchQuery.toLowerCase();
      return (
        (r.guestName || "").toLowerCase().includes(q) ||
        (r.id || "").toLowerCase().includes(q)
      );
    });

  const { year, month } = calMonth;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });
  const shiftMonth = (delta) =>
    setCalMonth(({ year: y, month: m }) => {
      const d = new Date(y, m + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const menuItems = [
    "Dashboard",
    "Calendar",
    "Bookings",
    "Clients",
    "Rooms",
    "Discounts",
    "Extras",
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#2f4f4f",
        color: "#333",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "250px" : "75px",
          backgroundColor: "#2f4f4f",
          color: "white",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            textAlign: sidebarOpen ? "left" : "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {sidebarOpen ? (
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                }}
              >
                DIVAA HOTEL in ROXAS
              </h3>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#a2b4b4",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Admin Panel
              </span>
            </div>
          ) : (
            <span style={{ fontWeight: "700", fontSize: "1.2rem" }}>DH</span>
          )}
        </div>

        <nav style={{ marginTop: "20px", flex: 1, padding: "0 10px" }}>
          {menuItems.map((id) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "12px 16px",
                  marginBottom: "4px",
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.12)"
                    : "transparent",
                  color: isActive ? "#ffffff" : "#c1d0d0",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "inset 3px 0 0 #b22222" : "none",
                }}
              >
                {sidebarOpen ? id : id.substring(0, 3)}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            padding: "15px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={onLogout}
            style={{
              width: "100%",
              padding: "10px 16px",
              backgroundColor: "#b22222",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
              boxShadow: "0 2px 4px rgba(178,34,34,0.3)",
            }}
          >
            {sidebarOpen ? "Logout" : "Exit"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        <div
          style={{
            height: "64px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            borderBottom: "1px solid #eef2f5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#2f4f4f",
                padding: "6px 10px",
              }}
            >
              ☰
            </button>
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                color: "#2f4f4f",
                fontWeight: "700",
              }}
            >
              {activeTab}
            </h2>
          </div>
          {currentUser && (
            <div style={{ fontSize: "0.85rem", color: "#607274" }}>
              Administrator:{" "}
              <strong style={{ color: "#2f4f4f" }}>
                {currentUser.displayName || currentUser.email}
              </strong>
            </div>
          )}
        </div>

        <div style={{ padding: "28px", flex: 1 }}>
          {loadError && (
            <div
              style={{
                background: "#fdf2f2",
                color: "#b22222",
                padding: "10px 14px",
                borderRadius: "6px",
                marginBottom: "14px",
                fontSize: "0.85rem",
              }}
            >
              {loadError}
            </div>
          )}

          {activeTab === "Dashboard" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <div style={{ ...card, marginBottom: "24px" }}>
                  {[
                    ["Total Reservations", reservations.length, "#2f4f4f"],
                    ["Confirmed", totalBooked, "#2e7d32"],
                    ["Pending", totalPending, "#d97706"],
                    ["Rooms Occupied Today", occupiedToday, "#2f4f4f"],
                    ["Available Rooms Today", availableRoomsCount, "#2e7d32"],
                  ].map(([label, value, color], i, arr) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 0",
                        borderBottom:
                          i < arr.length - 1 ? "1px solid #f2f5f8" : "none",
                      }}
                    >
                      <span style={{ color: "#607274", fontSize: "0.95rem" }}>
                        {label}
                      </span>
                      <strong style={{ color, fontSize: "1.1rem" }}>
                        {value}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={card}>
                  <h4
                    style={{
                      margin: "0 0 16px 0",
                      color: "#2f4f4f",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      fontWeight: "700",
                    }}
                  >
                    Available Rooms By Type
                  </h4>
                  {availableByType.map(({ name, count }) => (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        fontSize: "0.9rem",
                        color: "#444",
                        borderBottom: "1px dashed #eef2f5",
                      }}
                    >
                      <span>{name}</span>
                      <strong style={{ color: "#2f4f4f" }}>{count}</strong>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab("Calendar")}
                    style={{
                      marginTop: "16px",
                      background: "none",
                      border: "none",
                      color: "#b22222",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      padding: 0,
                    }}
                  >
                    View Calendar →
                  </button>
                </div>
              </div>

              <div>
                <div style={{ ...card, minHeight: "260px" }}>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #eef2f5",
                      marginBottom: "16px",
                    }}
                  >
                    {["Arrivals", "Departures"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setArrivalsTab(t)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          background: "none",
                          borderBottom:
                            arrivalsTab === t
                              ? "2px solid #2f4f4f"
                              : "2px solid transparent",
                          fontWeight: arrivalsTab === t ? "700" : "500",
                          color: arrivalsTab === t ? "#2f4f4f" : "#888",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {listToShow.length === 0 ? (
                    <div
                      style={{
                        color: "#777",
                        fontSize: "0.9rem",
                        textAlign: "center",
                        paddingTop: "40px",
                      }}
                    >
                      No upcoming {arrivalsTab.toLowerCase()}
                    </div>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {listToShow.slice(0, 8).map((r) => {
                        const date =
                          arrivalsTab === "Arrivals" ? r.checkIn : r.checkOut;
                        return (
                          <li
                            key={r.id}
                            style={{
                              padding: "10px 0",
                              borderBottom: "1px solid #f2f5f8",
                              fontSize: "0.88rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <strong style={{ color: "#2f4f4f" }}>
                                {r.guestName}
                              </strong>
                              <span
                                style={{
                                  color: date === today ? "#b22222" : "#777",
                                  fontWeight: date === today ? "700" : "500",
                                }}
                              >
                                {date === today ? "Today" : date}
                              </span>
                            </div>
                            <div style={{ color: "#777", fontSize: "0.8rem" }}>
                              {r.roomType} · {r.status}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Calendar" && (
            <div style={card}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#2f4f4f",
                      fontSize: "1.15rem",
                      fontWeight: "700",
                    }}
                  >
                    Room Occupancy Calendar
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      color: "#777",
                      fontSize: "0.85rem",
                    }}
                  >
                    Rooms booked per day (Pending + Confirmed)
                  </p>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <button onClick={() => shiftMonth(-1)} style={navBtn}>
                    ‹
                  </button>
                  <strong
                    style={{
                      color: "#2f4f4f",
                      minWidth: "140px",
                      textAlign: "center",
                    }}
                  >
                    {monthLabel}
                  </strong>
                  <button onClick={() => shiftMonth(1)} style={navBtn}>
                    ›
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "8px",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    style={{
                      fontWeight: "600",
                      padding: "10px",
                      backgroundColor: "#f4f6f9",
                      color: "#2f4f4f",
                      borderRadius: "6px",
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstWeekday }).map((_, i) => (
                  <div key={"blank" + i} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${year}-${pad(month + 1)}-${pad(dayNum)}`;
                  const count = active.filter(
                    (r) => r.checkIn <= dateStr && dateStr < r.checkOut,
                  ).length;
                  const isToday = dateStr === today;
                  return (
                    <div
                      key={dayNum}
                      style={{
                        padding: "12px 10px",
                        border: isToday
                          ? "2px solid #2f4f4f"
                          : "1px solid #eef2f5",
                        borderRadius: "6px",
                        backgroundColor: count > 0 ? "#fdf2f2" : "#ffffff",
                        minHeight: "75px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          color: "#2f4f4f",
                          fontSize: "0.85rem",
                        }}
                      >
                        {dayNum}
                      </span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: "600",
                          color: count > 0 ? "#b22222" : "#2e7d32",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor:
                            count > 0
                              ? "rgba(178,34,34,0.08)"
                              : "rgba(46,125,50,0.08)",
                          textAlign: "center",
                        }}
                      >
                        {count > 0 ? `${count} booked` : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "Bookings" && (
            <div style={{ ...card, padding: "28px" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#607274",
                  marginBottom: "14px",
                }}
              >
                {lastLoaded
                  ? `Loaded ${reservations.length} reservation(s) from the database at ${lastLoaded}`
                  : "Loading reservations..."}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <input
                  type="text"
                  placeholder="Search guest or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    width: "280px",
                    borderRadius: "6px",
                    border: "1px solid #dcdfe4",
                    fontSize: "0.88rem",
                    outline: "none",
                    backgroundColor: "#fff",
                    color: "#333",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={loadReservations} style={lightBtn}>
                    ⟳ Refresh
                  </button>
                  <button
                    onClick={() => {
                      setFormData(emptyForm);
                      setIsAddModalOpen(true);
                    }}
                    style={{
                      ...lightBtn,
                      backgroundColor: "#2f4f4f",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    + Add New Booking
                  </button>

                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      backgroundColor: "#eef2f5",
                      padding: "3px",
                      borderRadius: "6px",
                    }}
                  >
                    {["All", "Pending", "Confirmed", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor:
                            filterStatus === st ? "#ffffff" : "transparent",
                          color: filterStatus === st ? "#2f4f4f" : "#607274",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: filterStatus === st ? "600" : "500",
                          fontSize: "0.82rem",
                          boxShadow:
                            filterStatus === st
                              ? "0 1px 3px rgba(0,0,0,0.08)"
                              : "none",
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.88rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#2f4f4f",
                        color: "white",
                        textAlign: "left",
                      }}
                    >
                      {[
                        "ID",
                        "Guest Details",
                        "Room",
                        "Dates",
                        "Amount",
                        "Status",
                        "Actions",
                      ].map((h, i, arr) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            borderRadius:
                              i === 0
                                ? "6px 0 0 6px"
                                : i === arr.length - 1
                                  ? "0 6px 6px 0"
                                  : 0,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          style={{
                            textAlign: "center",
                            padding: "28px",
                            color: "#888",
                          }}
                        >
                          No reservations found.
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((res) => (
                        <tr
                          key={res.id}
                          style={{ borderBottom: "1px solid #f2f5f8" }}
                        >
                          <td
                            style={{
                              padding: "14px 16px",
                              fontWeight: "600",
                              color: "#2f4f4f",
                            }}
                          >
                            {res.id}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: "600", color: "#333" }}>
                              {res.guestName}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#777" }}>
                              {res.email} | {res.phone}
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            {res.roomType}
                            <div style={{ fontSize: "0.78rem", color: "#777" }}>
                              {res.guests} guest(s)
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#555" }}>
                            {res.checkIn} to {res.checkOut}
                            <div style={{ fontSize: "0.78rem", color: "#777" }}>
                              {res.nights} night(s)
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "14px 16px",
                              fontWeight: "700",
                              color: "#b22222",
                            }}
                          >
                            {money(res.totalAmount)}
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "#777",
                                fontWeight: "500",
                              }}
                            >
                              {res.paymentMethod}
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <select
                              value={res.status}
                              onChange={(e) =>
                                handleStatusQuickChange(res.id, e.target.value)
                              }
                              style={{
                                padding: "6px 10px",
                                borderRadius: "4px",
                                fontWeight: "600",
                                fontSize: "0.82rem",
                                border: "1px solid #dcdfe4",
                                backgroundColor: "#ffffff",
                                color: statusColor(res.status),
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                onClick={() => handleOpenEdit(res)}
                                style={{
                                  backgroundColor: "#ffffff",
                                  color: "#2f4f4f",
                                  border: "1px solid #dcdfe4",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(res.id)}
                                style={{
                                  backgroundColor: "rgba(178,34,34,0.08)",
                                  color: "#b22222",
                                  border: "1px solid rgba(178,34,34,0.2)",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  fontSize: "0.8rem",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Clients" && (
            <div style={{ ...card, padding: "28px" }}>
              <h3 style={sectionTitle}>Client Directory</h3>
              {reservations.length === 0 ? (
                <p style={{ color: "#888" }}>No clients yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {reservations.map((res) => (
                    <li
                      key={res.id}
                      style={{
                        padding: "14px 0",
                        borderBottom: "1px solid #f2f5f8",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600", color: "#333" }}>
                          {res.guestName}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#777" }}>
                          {res.email} | {res.phone}
                        </div>
                      </div>
                      <span
                        style={{
                          color: "#2f4f4f",
                          fontWeight: "600",
                          fontSize: "0.88rem",
                          backgroundColor: "#f4f6f9",
                          padding: "4px 10px",
                          borderRadius: "4px",
                        }}
                      >
                        {res.roomType}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "Rooms" && (
            <div style={{ ...card, padding: "28px" }}>
              <h3 style={{ ...sectionTitle, marginBottom: "8px" }}>
                Room Management
              </h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: "#777",
                  fontSize: "0.88rem",
                }}
              >
                Hotel room capacity and base prices.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {ROOMS.map((room) => (
                  <div
                    key={room.name}
                    style={{
                      padding: "20px",
                      border: "1px solid #eef2f5",
                      borderRadius: "8px",
                      backgroundColor: "#fcfdfe",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", color: "#2f4f4f" }}>
                      {room.name}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      Total Inventory: {room.qty} Rooms
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        fontWeight: "700",
                        color: "#9a7430",
                      }}
                    >
                      {money(room.price)} / night
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Discounts" && (
            <div style={{ ...card, padding: "28px" }}>
              <h3 style={{ ...sectionTitle, marginBottom: "8px" }}>
                Discount Vouchers
              </h3>
              <p style={{ margin: 0, color: "#777", fontSize: "0.88rem" }}>
                Create promotional discount codes for direct bookings.
              </p>
            </div>
          )}

          {activeTab === "Extras" && (
            <div style={{ ...card, padding: "28px" }}>
              <h3 style={{ ...sectionTitle, marginBottom: "8px" }}>
                Extras and Services
              </h3>
              <p style={{ margin: 0, color: "#777", fontSize: "0.88rem" }}>
                Manage add-on amenities and extra charges.
              </p>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <BookingModal
          title="Add New Reservation"
          submitLabel="Save Booking"
          form={formData}
          onChange={handleInputChange}
          onSubmit={handleCreateBooking}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <BookingModal
          title="Edit Booking"
          submitLabel="Update Booking"
          form={formData}
          onChange={handleInputChange}
          onSubmit={handleUpdateBooking}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

const sectionTitle = {
  margin: "0 0 16px 0",
  color: "#2f4f4f",
  fontSize: "1.15rem",
  fontWeight: "700",
};

const lightBtn = {
  padding: "10px 18px",
  borderRadius: "6px",
  border: "1px solid #dcdfe4",
  background: "#fff",
  color: "#2f4f4f",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.88rem",
};

const navBtn = {
  width: "34px",
  height: "34px",
  borderRadius: "6px",
  border: "1px solid #dcdfe4",
  background: "#fff",
  color: "#2f4f4f",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "700",
};
