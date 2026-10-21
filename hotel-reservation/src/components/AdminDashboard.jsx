// File: AdminDashboard.jsx
import React, { useState, useEffect } from "react";

export default function AdminDashboard({ onLogout, currentUser }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [arrivalsTab, setArrivalsTab] = useState("Arrivals");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    guestName: "",
    email: "",
    phone: "",
    roomType: "Standard Room",
    checkIn: "",
    checkOut: "",
    totalAmount: 1200,
    status: "Pending",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const data = JSON.parse(localStorage.getItem("hotel_reservations") || "[]");
    setReservations(data);
  };

  const saveToStorage = (data) => {
    setReservations(data);
    localStorage.setItem("hotel_reservations", JSON.stringify(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const newReservation = {
      id: "RES-" + Date.now().toString().slice(-6),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReservation, ...reservations];
    saveToStorage(updated);
    setIsAddModalOpen(false);
    setFormData(emptyForm);
  };

  const handleOpenEdit = (res) => {
    setEditingId(res.id);
    setFormData({
      guestName: res.guestName,
      email: res.email,
      phone: res.phone,
      roomType: res.roomType,
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      totalAmount: res.totalAmount,
      status: res.status,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = (e) => {
    e.preventDefault();
    const updated = reservations.map((res) =>
      res.id === editingId ? { ...res, ...formData } : res,
    );
    saveToStorage(updated);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleStatusQuickChange = (id, newStatus) => {
    const updated = reservations.map((res) =>
      res.id === id ? { ...res, status: newStatus } : res,
    );
    saveToStorage(updated);
  };

  const handleDeleteBooking = (id) => {
    if (
      window.confirm(
        "Sigurado ka bang gusto mong burahin ang reservation na ito?",
      )
    ) {
      const updated = reservations.filter((res) => res.id !== id);
      saveToStorage(updated);
    }
  };

  const totalBooked = reservations.filter(
    (r) => r.status === "Confirmed",
  ).length;
  const totalPending = reservations.filter(
    (r) => r.status === "Pending",
  ).length;
  const availableRoomsCount = Math.max(0, 34 - totalBooked);

  const roomTypesCount = {
    "Standard Room": 8,
    "Deluxe Queen Room": 8,
    "Family Suite Room": 8,
    "Barkada Group Room": 6,
    Studio: 4,
  };

  const menuItems = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Calendar", label: "Calendar" },
    { id: "Bookings", label: "Bookings" },
    { id: "Clients", label: "Clients" },
    { id: "Rooms", label: "Rooms" },
    { id: "Discounts", label: "Discounts" },
    { id: "Extras", label: "Extras" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#f4f6f9",
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
                DIVAA HOTEL
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
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
                {sidebarOpen ? (
                  <span>{item.label}</span>
                ) : (
                  <span>{item.label.substring(0, 3)}</span>
                )}
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
              letterSpacing: "0.3px",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(178,34,34,0.3)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#961c1c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#b22222")
            }
          >
            {sidebarOpen ? "Logout" : "Exit"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
        }}
      >
        {/* Top Header */}
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
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                letterSpacing: "-0.3px",
              }}
            >
              {activeTab}
            </h2>
          </div>

          {currentUser && (
            <div
              style={{
                fontSize: "0.85rem",
                color: "#607274",
                fontWeight: "500",
              }}
            >
              Administrator:{" "}
              <strong style={{ color: "#2f4f4f" }}>
                {currentUser.displayName || currentUser.email}
              </strong>
            </div>
          )}
        </div>

        {/* Dynamic View Body */}
        <div style={{ padding: "28px", flex: 1 }}>
          {activeTab === "Dashboard" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr",
                gap: "24px",
              }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    marginBottom: "24px",
                    border: "1px solid #eef2f5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom: "1px solid #f2f5f8",
                    }}
                  >
                    <span style={{ color: "#607274", fontSize: "0.95rem" }}>
                      Rooms Booked Today
                    </span>
                    <strong style={{ color: "#2f4f4f", fontSize: "1.1rem" }}>
                      {totalBooked}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "14px 0",
                      borderBottom: "1px solid #f2f5f8",
                    }}
                  >
                    <span style={{ color: "#607274", fontSize: "0.95rem" }}>
                      Pending Rooms Today
                    </span>
                    <strong style={{ color: "#b22222", fontSize: "1.1rem" }}>
                      {totalPending}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "14px 0",
                    }}
                  >
                    <span style={{ color: "#607274", fontSize: "0.95rem" }}>
                      Available Rooms Today
                    </span>
                    <strong style={{ color: "#2e7d32", fontSize: "1.1rem" }}>
                      {availableRoomsCount}
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    border: "1px solid #eef2f5",
                  }}
                >
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
                  {Object.entries(roomTypesCount).map(([type, count]) => (
                    <div
                      key={type}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        fontSize: "0.9rem",
                        color: "#444",
                        borderBottom: "1px dashed #eef2f5",
                      }}
                    >
                      <span>{type}</span>
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
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                    border: "1px solid #eef2f5",
                    minHeight: "260px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #eef2f5",
                      marginBottom: "16px",
                    }}
                  >
                    <button
                      onClick={() => setArrivalsTab("Arrivals")}
                      style={{
                        padding: "10px 16px",
                        border: "none",
                        background: "none",
                        borderBottom:
                          arrivalsTab === "Arrivals"
                            ? "2px solid #2f4f4f"
                            : "2px solid transparent",
                        fontWeight: arrivalsTab === "Arrivals" ? "700" : "500",
                        color: arrivalsTab === "Arrivals" ? "#2f4f4f" : "#888",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Arrivals
                    </button>
                    <button
                      onClick={() => setArrivalsTab("Departures")}
                      style={{
                        padding: "10px 16px",
                        border: "none",
                        background: "none",
                        borderBottom:
                          arrivalsTab === "Departures"
                            ? "2px solid #2f4f4f"
                            : "2px solid transparent",
                        fontWeight:
                          arrivalsTab === "Departures" ? "700" : "500",
                        color:
                          arrivalsTab === "Departures" ? "#2f4f4f" : "#888",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Departures
                    </button>
                  </div>

                  <div
                    style={{
                      color: "#777",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      paddingTop: "40px",
                    }}
                  >
                    {arrivalsTab === "Arrivals"
                      ? reservations.length === 0
                        ? "No arrivals scheduled today"
                        : `Incoming guests today: ${reservations.length}`
                      : "No departures scheduled today"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR TAB (FULL INTERACTIVE GRID) */}
          {activeTab === "Calendar" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
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
                    Monthly reservation schedule & room availability grid
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "8px",
                  marginTop: "16px",
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
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
                      {day}
                    </div>
                  ),
                )}
                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isBooked = dayNum % 4 === 0 || dayNum % 7 === 0;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "14px 10px",
                        border: "1px solid #eef2f5",
                        borderRadius: "6px",
                        backgroundColor: isBooked ? "#fdf2f2" : "#ffffff",
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
                          color: isBooked ? "#b22222" : "#2e7d32",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: isBooked
                            ? "rgba(178,34,34,0.08)"
                            : "rgba(46,125,50,0.08)",
                          textAlign: "center",
                        }}
                      >
                        {isBooked ? "Booked" : "Available"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BOOKINGS TAB (CRUD MANAGEMENT) */}
          {activeTab === "Bookings" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
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
                  }}
                />

                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <button
                    onClick={() => {
                      setFormData(emptyForm);
                      setIsAddModalOpen(true);
                    }}
                    style={{
                      backgroundColor: "#2f4f4f",
                      color: "white",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.88rem",
                      boxShadow: "0 2px 4px rgba(47,79,79,0.2)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    + Add New Booking
                  </button>

                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      backgroundColor: "#f4f6f9",
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

              {/* READ Table */}
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
                      <th
                        style={{
                          padding: "12px 16px",
                          borderRadius: "6px 0 0 6px",
                        }}
                      >
                        ID
                      </th>
                      <th style={{ padding: "12px 16px" }}>Guest Details</th>
                      <th style={{ padding: "12px 16px" }}>Room</th>
                      <th style={{ padding: "12px 16px" }}>Dates</th>
                      <th style={{ padding: "12px 16px" }}>Amount</th>
                      <th style={{ padding: "12px 16px" }}>Status</th>
                      <th
                        style={{
                          padding: "12px 16px",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length === 0 ? (
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
                      reservations
                        .filter(
                          (r) =>
                            filterStatus === "All" || r.status === filterStatus,
                        )
                        .filter(
                          (r) =>
                            r.guestName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            r.id
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((res) => (
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
                              <div
                                style={{ fontSize: "0.8rem", color: "#777" }}
                              >
                                {res.email} | {res.phone}
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              {res.roomType}
                            </td>
                            <td style={{ padding: "14px 16px", color: "#555" }}>
                              {res.checkIn} to {res.checkOut}
                            </td>
                            <td
                              style={{
                                padding: "14px 16px",
                                fontWeight: "700",
                                color: "#b22222",
                              }}
                            >
                              ₱{res.totalAmount}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <select
                                value={res.status}
                                onChange={(e) =>
                                  handleStatusQuickChange(
                                    res.id,
                                    e.target.value,
                                  )
                                }
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: "4px",
                                  fontWeight: "600",
                                  fontSize: "0.82rem",
                                  border: "1px solid #dcdfe4",
                                  backgroundColor: "#ffffff",
                                  color:
                                    res.status === "Confirmed"
                                      ? "#2e7d32"
                                      : res.status === "Cancelled"
                                        ? "#b22222"
                                        : "#d97706",
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
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  color: "#2f4f4f",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                }}
              >
                Client Directory
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {reservations.map((res, i) => (
                  <li
                    key={i}
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
            </div>
          )}

          {activeTab === "Rooms" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#2f4f4f",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                }}
              >
                Room Management
              </h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: "#777",
                  fontSize: "0.88rem",
                }}
              >
                Configure hotel room capacity and base prices.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "16px",
                }}
              >
                {Object.entries(roomTypesCount).map(([type, qty], i) => (
                  <div
                    key={i}
                    style={{
                      padding: "20px",
                      border: "1px solid #eef2f5",
                      borderRadius: "8px",
                      backgroundColor: "#fcfdfe",
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0", color: "#2f4f4f" }}>
                      {type}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      Total Inventory: {qty} Rooms
                    </p>
                    <button
                      style={{
                        backgroundColor: "#2f4f4f",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.82rem",
                      }}
                    >
                      Edit Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Discounts" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#2f4f4f",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                }}
              >
                Discount Vouchers
              </h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: "#777",
                  fontSize: "0.88rem",
                }}
              >
                Create promotional discount codes for direct bookings.
              </p>
            </div>
          )}

          {activeTab === "Extras" && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "28px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                border: "1px solid #eef2f5",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "#2f4f4f",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                }}
              >
                Extras and Services
              </h3>
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: "#777",
                  fontSize: "0.88rem",
                }}
              >
                Manage add-on amenities and extra charges.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
              width: "420px",
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
              Add New Reservation
            </h3>
            <form onSubmit={handleCreateBooking}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Guest Name:
                </label>
                <input
                  type="text"
                  name="guestName"
                  required
                  value={formData.guestName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Room Type:
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                >
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Queen Room">Deluxe Queen Room</option>
                  <option value="Family Suite Room">Family Suite Room</option>
                  <option value="Barkada Group Room">Barkada Group Room</option>
                </select>
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    Check-In:
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdfe4",
                      boxSizing: "border-box",
                      marginTop: "4px",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    Check-Out:
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdfe4",
                      boxSizing: "border-box",
                      marginTop: "4px",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Amount (₱):
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  required
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #dcdfe4",
                    backgroundColor: "#fff",
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
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
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
              width: "420px",
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
              Edit Booking
            </h3>
            <form onSubmit={handleUpdateBooking}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Guest Name:
                </label>
                <input
                  type="text"
                  name="guestName"
                  required
                  value={formData.guestName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Room Type:
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                >
                  <option value="Standard Room">Standard Room</option>
                  <option value="Deluxe Queen Room">Deluxe Queen Room</option>
                  <option value="Family Suite Room">Family Suite Room</option>
                  <option value="Barkada Group Room">Barkada Group Room</option>
                </select>
              </div>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    Check-In:
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdfe4",
                      boxSizing: "border-box",
                      marginTop: "4px",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    Check-Out:
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #dcdfe4",
                      boxSizing: "border-box",
                      marginTop: "4px",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    color: "#444",
                  }}
                >
                  Amount (₱):
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  required
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #dcdfe4",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #dcdfe4",
                    backgroundColor: "#fff",
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
                  Update Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
