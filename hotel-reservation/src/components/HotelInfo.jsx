// File: HotelInfo.jsx
import React, { useState } from "react";

export default function HotelInfo({ onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    roomType: "Standard Room",
    checkIn: "",
    checkOut: "",
    guests: 1,
    notes: "",
  });

  const navLinkStyle = {
    margin: "0 15px",
    textDecoration: "none",
    color: "#2f4f4f",
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  const rooms = [
    {
      name: "Standard Room",
      price: 1200,
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      description:
        "A cozy and clean room with aircon, private bathroom, free Wi-Fi, and flat screen TV.",
    },
    {
      name: "Deluxe Queen Room",
      price: 1600,
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
      description:
        "Spacious air-conditioned room with work desk, mini fridge, and complimentary coffee.",
    },
    {
      name: "Family Suite Room",
      price: 2400,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      description:
        "Designed for families or friends. Features 2 large beds, spacious bath, and seating area.",
    },
    {
      name: "Barkada Group Room",
      price: 3200,
      image:
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
      description:
        "Affordable group stay for up to 6 persons. Perfect for student trips or events.",
    },
  ];

  const foodItems = [
    {
      title: "Filipino Buffet Breakfast",
      price: "₱350 / head",
      image:
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
      desc: "Warm garlic rice, eggs, longganisa, cured beef tapa, and fresh fruits.",
    },
    {
      title: "Fresh Seafood Platter",
      price: "₱850 / platter",
      image:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      desc: "Fresh Mindoro coastal catch, grilled prawns, squid, and buttered crabs.",
    },
    {
      title: "Artisanal Coffee & Pastries",
      price: "₱180+",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      desc: "Freshly brewed local highland coffee paired with homemade baked buns.",
    },
    {
      title: "Tropical Cocktails & Drinks",
      price: "₱220+",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      desc: "Cool off with fresh mango smoothies, coconut juice, or signature cocktails.",
    },
  ];

  const handleOpenModal = (roomName) => {
    if (roomName) {
      setFormData((prev) => ({ ...prev, roomType: roomName }));
    }
    setIsModalOpen(true);
    setBookingSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const room = rooms.find((r) => r.name === formData.roomType) || rooms[0];
    if (!formData.checkIn || !formData.checkOut) return room.price;
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return (isNaN(nights) ? 1 : nights) * room.price;
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    const existingBookings = JSON.parse(
      localStorage.getItem("hotel_reservations") || "[]",
    );
    const newReservation = {
      id: "RES-" + Date.now().toString().slice(-6),
      ...formData,
      totalAmount: calculateTotal(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "hotel_reservations",
      JSON.stringify([newReservation, ...existingBookings]),
    );
    setBookingSuccess(true);

    setTimeout(() => {
      setIsModalOpen(false);
      setBookingSuccess(false);
      setFormData({
        guestName: "",
        email: "",
        phone: "",
        roomType: "Standard Room",
        checkIn: "",
        checkOut: "",
        guests: 1,
        notes: "",
      });
    }, 2000);
  };

  return (
    <div
      style={{
        fontFamily: "Roboto, sans-serif",
        color: "#333",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          backgroundColor: "rgba(255,255,255,0.95)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          boxSizing: "border-box",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontWeight: "700", color: "#2f4f4f", margin: 0 }}>
          DIVAA HOTEL
        </h2>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <a href="#home" style={navLinkStyle}>
            Home
          </a>
          <a href="#hotel" style={navLinkStyle}>
            The Hotel
          </a>
          <a href="#rooms" style={navLinkStyle}>
            Our Rooms
          </a>
          <a href="#food" style={navLinkStyle}>
            Food & Drink
          </a>
          <a href="#contact" style={navLinkStyle}>
            Contact
          </a>
          <button
            onClick={() => handleOpenModal()}
            style={{
              backgroundColor: "#2f4f4f",
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Booking
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ fontSize: "1rem", color: "#444" }}>
            ⭐ 4.4 (Google reviews)
          </p>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#2f4f4f",
              margin: "10px 0",
            }}
          >
            Sleep well in the heart of Roxas, Oriental Mindoro
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            Clean rooms, simple booking, and a comfortable stay.
          </p>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => handleOpenModal()}
              style={{
                backgroundColor: "#2f4f4f",
                color: "white",
                border: "none",
                padding: "12px 24px",
                marginRight: "10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Reserve Now
            </button>
            <a
              href="#contact"
              style={{
                backgroundColor: "#b22222",
                color: "white",
                textDecoration: "none",
                padding: "12px 24px",
                borderRadius: "4px",
                display: "inline-block",
                fontSize: "1rem",
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Info Cards / The Hotel */}
      <section
        id="hotel"
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "60px 20px",
          backgroundColor: "#f9f9f9",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {[
          {
            title: "Unique and Personal",
            text: "We offer a unique and personal hotel experience. Feel at home while we go the extra mile to fulfill your needs.",
          },
          {
            title: "The Extra Mile",
            text: "Enjoy free fitness access and discounts at selected restaurants and bars. Experience Roxas, Oriental Mindoro by bike or on foot.",
          },
          {
            title: "Transport and Parking",
            text: "Conveniently located near bus terminals and ports. Easy access to local attractions and transport hubs.",
          },
        ].map((info, i) => (
          <div
            key={i}
            style={{
              width: "300px",
              flex: "1 1 280px",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: "#2f4f4f", marginTop: 0 }}>{info.title}</h3>
            <p style={{ lineHeight: "1.6", color: "#666" }}>{info.text}</p>
          </div>
        ))}
      </section>

      {/* Rooms Section */}
      <section
        id="rooms"
        style={{ padding: "60px 20px", backgroundColor: "#fff" }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#2f4f4f",
          }}
        >
          Our Rooms
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {rooms.map((room, i) => (
            <div
              key={i}
              style={{
                width: "280px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <img
                  src={room.image}
                  alt={room.name}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#2f4f4f" }}>
                    {room.name}
                  </h3>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#b22222",
                      margin: "0 0 10px 0",
                    }}
                  >
                    ₱{room.price} / night
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      lineHeight: "1.4",
                    }}
                  >
                    {room.description}
                  </p>
                </div>
              </div>
              <div style={{ padding: "15px", paddingTop: 0 }}>
                <button
                  onClick={() => handleOpenModal(room.name)}
                  style={{
                    width: "100%",
                    backgroundColor: "#2f4f4f",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Reserve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food & Drink Section */}
      <section
        id="food"
        style={{ padding: "60px 20px", backgroundColor: "#f9f9f9" }}
      >
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}
        >
          <h2 style={{ color: "#2f4f4f", marginBottom: "10px" }}>
            Food & Drink
          </h2>
          <p style={{ color: "#555", marginBottom: "30px" }}>
            Experience fresh Mindoro seafood and delicious local dishes at our
            dining hall.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {foodItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: "250px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  textAlign: "left",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px" }}>
                  <h4 style={{ margin: 0, color: "#2f4f4f", fontSize: "1rem" }}>
                    {item.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#b22222",
                      fontWeight: "bold",
                    }}
                  >
                    {item.price}
                  </span>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          padding: "60px 20px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2f4f4f", marginBottom: "20px" }}>Contact Us</h2>
        <div style={{ marginTop: "20px", lineHeight: "1.8", color: "#444" }}>
          <p>
            📍 <strong>Address:</strong> Roxas, Oriental Mindoro, Philippines
          </p>
          <p>
            📞 <strong>Phone:</strong> +63 (043) 123-4567
          </p>
          <p>
            ✉️ <strong>Email:</strong> info@divaahotel.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2f4f4f",
          color: "white",
          textAlign: "center",
          padding: "25px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} DIVAA HOTEL. All rights reserved.
        </p>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#b22222",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#8b0000")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#b22222")
          }
        >
          Logout 🚪
        </button>
      </footer>

      {/* Reservation Modal Popup */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <h3 style={{ marginTop: 0, color: "#2f4f4f" }}>
              Hotel Reservation Form
            </h3>

            {bookingSuccess ? (
              <div
                style={{
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  padding: "15px",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                🎉 Reservation Submitted Successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    Full Name:
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    required
                    value={formData.guestName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    Contact Number:
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
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
                      padding: "8px",
                      boxSizing: "border-box",
                    }}
                  >
                    {rooms.map((r, i) => (
                      <option key={i} value={r.name}>
                        {r.name} (₱{r.price}/night)
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
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
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
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
                        padding: "8px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: "#f0f4f4",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Estimated Total:</strong> ₱{calculateTotal()}
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#2f4f4f",
                    color: "white",
                    padding: "12px",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
