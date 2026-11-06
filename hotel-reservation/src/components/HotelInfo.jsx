import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const hotelStyles = `
.bb-chip {
  border: 1px solid #1d3f40;
  background: transparent;
  color: #1d3f40;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.25s ease, color 0.25s ease;
}
.bb-chip:hover { background: #f3ead7; }
.bb-chip.active { background: #10292a; border-color: #10292a; color: #d8b46a; }

.bb-room-card {
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.bb-room-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(16, 41, 42, 0.28);
}
.bb-room-card img { transition: transform 0.6s ease; }
.bb-room-card:hover img { transform: scale(1.08); }
.bb-room-media { position: relative; overflow: hidden; }
.bb-room-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(16, 41, 42, 0.85);
  color: #d8b46a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}
.bb-room-btn { transition: background-color 0.25s ease, letter-spacing 0.25s ease; }
.bb-room-btn:hover { background-color: #e6c680 !important; letter-spacing: 0.4px; }

.bb-menu {
  background: linear-gradient(160deg, #10292a 0%, #1d3f40 55%, #2a5253 100%);
  color: #f3ead7;
}
.bb-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
  max-width: 1300px;
  margin: 0 auto;
}
.bb-menu-card {
  position: relative;
  height: 380px;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.bb-menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
.bb-menu-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease, filter 0.5s ease;
}
.bb-menu-card:hover img { transform: scale(1.12); filter: brightness(0.55); }
.bb-menu-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8, 22, 22, 0.92) 0%, rgba(8, 22, 22, 0.35) 45%, rgba(8, 22, 22, 0) 70%);
}
.bb-menu-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(243, 234, 215, 0.16);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(243, 234, 215, 0.35);
  color: #f3ead7;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
}
.bb-menu-price {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #d8b46a;
  color: #10292a;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 10px;
  transition: transform 0.35s ease;
}
.bb-menu-card:hover .bb-menu-price { transform: scale(1.1) rotate(-3deg); }
.bb-menu-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  text-align: left;
}
.bb-menu-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
}
.bb-menu-line {
  width: 36px;
  height: 3px;
  background: #d8b46a;
  border-radius: 2px;
  margin: 10px 0;
  transition: width 0.4s ease;
}
.bb-menu-card:hover .bb-menu-line { width: 90px; }
.bb-menu-desc {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #e6dcc6;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease;
}
.bb-menu-card:hover .bb-menu-desc { max-height: 120px; opacity: 1; }
.bb-menu-tab {
  border: 1px solid rgba(243, 234, 215, 0.4);
  background: transparent;
  color: #f3ead7;
  padding: 9px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.92rem;
  font-weight: 600;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.bb-menu-tab:hover { border-color: #d8b46a; color: #d8b46a; }
.bb-menu-tab.active { background: #d8b46a; border-color: #d8b46a; color: #10292a; }

.bb-overlay { animation: bbFade 0.25s ease; }
.bb-modal { animation: bbRise 0.3s ease; }
@keyframes bbFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes bbRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

.bb-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1d3f40;
  margin-bottom: 6px;
  text-align: left;
}
.bb-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  background-color: #ffffff;
  color: #1f2d2d;
  border: 1px solid #d9cba5;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  color-scheme: light;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.bb-input::placeholder { color: #9aa8a8; }
.bb-input:hover { border-color: #b8923f; }
.bb-input:focus {
  outline: none;
  border-color: #b8923f;
  box-shadow: 0 0 0 3px rgba(216, 180, 106, 0.35);
}
.bb-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}
.bb-field { margin-bottom: 16px; }
.bb-pay-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.bb-pay {
  border: 1px solid #d9cba5;
  background: #fff;
  color: #1d3f40;
  border-radius: 8px;
  padding: 10px 8px;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}
.bb-pay:hover { border-color: #b8923f; transform: translateY(-1px); }
.bb-pay.active { background: #10292a; color: #d8b46a; border-color: #10292a; }
.bb-submit {
  width: 100%;
  background-color: #d8b46a;
  color: #10292a;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.bb-submit:hover:not(:disabled) {
  background-color: #e6c680;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(216, 180, 106, 0.4);
}
.bb-submit:disabled { background-color: #e4dcc6; color: #9a917a; cursor: not-allowed; }
.bb-close { transition: background-color 0.2s ease, color 0.2s ease; }
.bb-close:hover { background-color: #f3ead7; color: #1d3f40; }

@media (hover: none) {
  .bb-menu-desc { max-height: 120px; opacity: 1; }
  .bb-menu-line { width: 90px; }
}
@media (prefers-reduced-motion: reduce) {
  .bb-room-card, .bb-room-card img, .bb-menu-card, .bb-menu-card img, .bb-modal, .bb-overlay { transition: none; animation: none; }
}
`;

const toDateInputValue = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const addDays = (dateString, days) => {
  const d = new Date(dateString + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toDateInputValue(d);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const emptyForm = {
  guestName: "",
  email: "",
  phone: "",
  roomType: "Standard Room",
  checkIn: "",
  checkOut: "",
  guests: 1,
  paymentMethod: "GCash",
  notes: "",
};

export default function HotelInfo({
  user,
  onLogin,
  onGoogleLogin,
  onSignup,
  authError,
  onLogout,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState(null);
  const [roomFilter, setRoomFilter] = useState("All");
  const [menuFilter, setMenuFilter] = useState("All");
  const [formData, setFormData] = useState(emptyForm);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const navLinkStyle = {
    margin: "0 15px",
    textDecoration: "none",
    color: "#f3ead7",
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  const rooms = [
    {
      name: "Economy Fan Room",
      category: "Standard",
      price: 800,
      capacity: 2,
      bed: "1 Double Bed",
      image:
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80",
      description:
        "A budget-friendly room with electric fan, private bathroom, and free Wi-Fi for a simple overnight stay.",
    },
    {
      name: "Solo Room",
      category: "Solo",
      price: 1000,
      capacity: 1,
      bed: "1 Single Bed",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
      description:
        "Perfect for solo travelers looking for a comfortable and affordable air-conditioned stay.",
    },
    {
      name: "Standard Room",
      category: "Standard",
      price: 1200,
      capacity: 2,
      bed: "1 Queen Bed",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      description:
        "A cozy and clean room equipped with air conditioning, a private bathroom, complimentary Wi-Fi, and a flat-screen TV.",
    },
    {
      name: "Twin Room",
      category: "Standard",
      price: 1400,
      capacity: 2,
      bed: "2 Single Beds",
      image:
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
      description:
        "Two separate single beds, ideal for friends, coworkers, or siblings traveling together.",
    },
    {
      name: "Deluxe Queen Room",
      category: "Deluxe",
      price: 1600,
      capacity: 2,
      bed: "1 Queen Bed + Work Desk",
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
      description:
        "A spacious air-conditioned room featuring a functional work desk, a mini refrigerator, and complimentary artisan coffee.",
    },
    {
      name: "Triple Room",
      category: "Family",
      price: 2000,
      capacity: 3,
      bed: "1 Queen + 1 Single Bed",
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      description:
        "A comfortable room for three guests with a queen bed, a single bed, and a small lounge corner.",
    },
    {
      name: "Family Suite Room",
      category: "Family",
      price: 2400,
      capacity: 4,
      bed: "2 Queen Beds",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      description:
        "Designed for families or groups, offering two large beds, an expansive bathroom, and a comfortable seating area.",
    },
    {
      name: "Honeymoon Suite",
      category: "Suite",
      price: 2800,
      capacity: 2,
      bed: "1 King Bed",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
      description:
        "A romantic suite with a king bed, private balcony, soaking bathtub, and breakfast for two.",
    },
    {
      name: "Barkada Group Room",
      category: "Group",
      price: 3200,
      capacity: 6,
      bed: "3 Bunk Beds / Twin Beds",
      image:
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
      description:
        "An economical group accommodation for up to six persons, ideal for team trips, student outings, and gatherings.",
    },
    {
      name: "Executive Suite",
      category: "Suite",
      price: 3800,
      capacity: 3,
      bed: "1 King Bed + Sofa Bed",
      image:
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80",
      description:
        "A separate living area, king bed, and work station for business travelers and longer stays.",
    },
    {
      name: "Rooftop Penthouse",
      category: "Suite",
      price: 4500,
      capacity: 4,
      bed: "1 King + 2 Single Beds",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      description:
        "Our top-floor suite with direct rooftop deck access and the best sunset view in the area.",
    },
  ];

  const roomCategories = [
    "All",
    "Solo",
    "Standard",
    "Deluxe",
    "Family",
    "Group",
    "Suite",
  ];

  const visibleRooms =
    roomFilter === "All"
      ? rooms
      : rooms.filter((r) => r.category === roomFilter);

  const foodItems = [
    {
      title: "Filipino Buffet Breakfast",
      category: "Breakfast",
      price: "₱350 / head",
      image:
        "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
      desc: "Traditional garlic rice, eggs, local longganisa, savory cured beef tapa, and seasonal fresh fruits.",
    },
    {
      title: "Fresh Seafood Platter",
      category: "Seafood",
      price: "₱850 / platter",
      image:
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      desc: "Local coastal catch featuring grilled prawns, tender squid, and buttered crabs.",
    },
    {
      title: "Artisanal Coffee & Pastries",
      category: "Coffee",
      price: "₱180+",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      desc: "Freshly brewed highland coffee served alongside premium homemade baked goods.",
    },
    {
      title: "Tropical Cocktails & Drinks",
      category: "Drinks",
      price: "₱220+",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      desc: "Refreshing fruit smoothies, fresh coconut water, and signature tropical cocktails.",
    },
    {
      title: "Iced Caramel Latte",
      category: "Coffee",
      price: "₱160",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
      desc: "Chilled espresso with milk and house caramel, served over ice for a cool afternoon break.",
    },
    {
      title: "Sunset Mojito",
      category: "Drinks",
      price: "₱240",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
      desc: "Fresh mint, lime, and soda with a hint of local calamansi, best enjoyed on the rooftop deck.",
    },
    {
      title: "Grilled Squid & Rice",
      category: "Seafood",
      price: "₱320",
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
      desc: "Charcoal-grilled squid with garlic rice, atchara, and a tangy dipping sauce.",
    },
    {
      title: "Tapsilog Morning Set",
      category: "Breakfast",
      price: "₱180",
      image:
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80",
      desc: "Tender beef tapa, garlic rice, and sunny-side-up egg served with hot coffee.",
    },
  ];

  const menuCategories = ["All", "Breakfast", "Seafood", "Coffee", "Drinks"];

  const visibleFood =
    menuFilter === "All"
      ? foodItems
      : foodItems.filter((f) => f.category === menuFilter);

  const paymentOptions = [
    "GCash",
    "Cash",
    "Bank Transfer",
    "Credit/Debit Card",
  ];

  const today = toDateInputValue(new Date());
  const selectedRoom =
    rooms.find((r) => r.name === formData.roomType) || rooms[0];
  const minCheckOut = formData.checkIn
    ? addDays(formData.checkIn, 1)
    : addDays(today, 1);
  const datesChosen = Boolean(formData.checkIn && formData.checkOut);
  const datesValid = datesChosen && formData.checkOut > formData.checkIn;

  const calculateNights = () => {
    if (!datesValid) return 0;
    const start = new Date(formData.checkIn + "T00:00:00");
    const end = new Date(formData.checkOut + "T00:00:00");
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalAmount = nights * selectedRoom.price;

  const openBookingForm = (roomName) => {
    setFormData({
      ...emptyForm,
      guestName: user?.displayName || user?.name || "",
      email: user?.email || "",
      roomType: roomName || emptyForm.roomType,
    });
    setBookingReceipt(null);
    setIsModalOpen(true);
  };

  const handleOpenModal = (roomName) => {
    if (!user) {
      setPendingBooking({ roomName: roomName || null });
      setIsLoginOpen(true);
      return;
    }
    openBookingForm(roomName);
  };

  const handleOpenLogin = () => {
    setPendingBooking(null);
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setPendingBooking(null);
  };

  useEffect(() => {
    if (!user) return;
    setIsLoginOpen(false);
    if (pendingBooking) {
      openBookingForm(pendingBooking.roomName);
      setPendingBooking(null);
    }
  }, [user]);

  useEffect(() => {
    if (authError && !user) setIsLoginOpen(true);
  }, [authError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "roomType") {
        const room = rooms.find((r) => r.name === value) || rooms[0];
        if (Number(next.guests) > room.capacity) next.guests = room.capacity;
      }
      if (name === "checkIn" && next.checkOut && next.checkOut <= value) {
        next.checkOut = "";
      }
      if (name === "guests") next.guests = Number(value);
      return next;
    });
  };

  const handleSelectPayment = (method) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!datesValid) return;

    const reservationData = {
      id: "RES-" + Date.now().toString().slice(-6),
      ...formData,
      nights,
      totalAmount,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
      if (!res.ok) throw new Error("Failed to save reservation");
      setBookingReceipt(reservationData);
    } catch (err) {
      console.error(err);
      alert("Hindi na-save ang reservation. Subukan ulit.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingReceipt(null);
    setFormData(emptyForm);
  };

  const receiptRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  };

  const receiptRows = bookingReceipt
    ? [
        ["Guest Name:", bookingReceipt.guestName],
        ["Email:", bookingReceipt.email],
        ["Contact Phone:", bookingReceipt.phone],
        ["Selected Room:", bookingReceipt.roomType],
        ["Guests:", bookingReceipt.guests],
        ["Check-In Date:", formatDate(bookingReceipt.checkIn)],
        ["Check-Out Date:", formatDate(bookingReceipt.checkOut)],
        ["Duration:", `${bookingReceipt.nights} night(s)`],
        ["Payment Method:", bookingReceipt.paymentMethod],
      ]
    : [];

  const authButtonStyle = {
    marginLeft: "12px",
    backgroundColor: "transparent",
    color: "#d8b46a",
    border: "1px solid #d8b46a",
    padding: "7px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.25s ease, color 0.25s ease",
  };

  const authButtonOver = (e) => {
    e.currentTarget.style.backgroundColor = "#d8b46a";
    e.currentTarget.style.color = "#10292a";
  };

  const authButtonOut = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#d8b46a";
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        color: "#333",
        margin: 0,
        padding: 0,
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#faf6ec",
      }}
    >
      <style>{hotelStyles}</style>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          backgroundColor: "rgba(16, 41, 42, 0.96)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          boxSizing: "border-box",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontWeight: "700", color: "#f3ead7", margin: 0 }}>
          DIVAA HOTEL IN ROXAS
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
              backgroundColor: "#d8b46a",
              color: "#10292a",
              border: "none",
              padding: "8px 18px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Booking
          </button>
          {user ? (
            <button
              onClick={onLogout}
              style={authButtonStyle}
              onMouseOver={authButtonOver}
              onMouseOut={authButtonOut}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={handleOpenLogin}
              style={authButtonStyle}
              onMouseOver={authButtonOver}
              onMouseOut={authButtonOut}
            >
              Sign in
            </button>
          )}
        </nav>
      </header>

      <section
        id="home"
        style={{
          backgroundImage:
            "url('data:image/jpeg;base64,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')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(16, 41, 42, 0.85)",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            maxWidth: "700px",
            width: "90%",
            margin: "0 20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
          }}
        >
          <p style={{ fontSize: "1rem", color: "#d8b46a" }}>
            ⭐ 4.8 (Google Reviews)
          </p>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#ffffff",
              margin: "10px 0",
            }}
          >
            Experience Comfort in the Heart of DIVAA HOTEL in Roxas
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#e6dcc6" }}>
            Immaculate accommodations, seamless booking, and exceptional
            hospitality.
          </p>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => handleOpenModal()}
              style={{
                backgroundColor: "#d8b46a",
                color: "#10292a",
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
                backgroundColor: "transparent",
                border: "2px solid #d8b46a",
                color: "#d8b46a",
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

      <section
        id="hotel"
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-around",
          padding: "60px 40px",
          backgroundColor: "#faf6ec",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {[
          {
            title: "Personalized Hospitality",
            text: "We provide tailored guest services designed to make you feel completely at home while attending to your every requirement.",
          },
          {
            title: "Exclusive Perks",
            text: "Enjoy complimentary fitness center access alongside dining discounts. Discover Roxas by foot or bicycle.",
          },
          {
            title: "Prime Accessibility",
            text: "Conveniently situated near major transportation terminals, providing effortless access to local landmarks.",
          },
        ].map((info, i) => (
          <div
            key={i}
            style={{
              width: "320px",
              flex: "1 1 280px",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              borderTop: "3px solid #d8b46a",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: "#1d3f40", marginTop: 0 }}>{info.title}</h3>
            <p style={{ lineHeight: "1.6", color: "#666" }}>{info.text}</p>
          </div>
        ))}
      </section>

      <section
        id="rooms"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "60px 40px",
          backgroundColor: "#f3ead7",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#1d3f40",
          }}
        >
          Our Accommodations
        </h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "26px" }}>
          {rooms.length} room types for solo travelers, couples, families, and
          groups.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "36px",
          }}
        >
          {roomCategories.map((cat) => (
            <button
              key={cat}
              className={`bb-chip${roomFilter === cat ? " active" : ""}`}
              onClick={() => setRoomFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {visibleRooms.map((room) => (
            <div
              key={room.name}
              className="bb-room-card"
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="bb-room-media">
                  <img
                    src={room.image}
                    alt={room.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <span className="bb-room-tag">{room.category}</span>
                </div>
                <div style={{ padding: "16px" }}>
                  <h3
                    style={{
                      margin: "0 0 6px 0",
                      color: "#1d3f40",
                      fontSize: "1.1rem",
                    }}
                  >
                    {room.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "0.82rem",
                      color: "#777",
                    }}
                  >
                    Up to {room.capacity} guest{room.capacity > 1 ? "s" : ""} ·{" "}
                    {room.bed}
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: "#9a7430",
                      margin: "0 0 10px 0",
                      fontSize: "1rem",
                    }}
                  >
                    ₱{room.price.toLocaleString()} / night
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    {room.description}
                  </p>
                </div>
              </div>
              <div style={{ padding: "16px", paddingTop: 0 }}>
                <button
                  className="bb-room-btn"
                  onClick={() => handleOpenModal(room.name)}
                  style={{
                    width: "100%",
                    backgroundColor: "#d8b46a",
                    color: "#10292a",
                    border: "none",
                    padding: "11px",
                    borderRadius: "6px",
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

      <section
        id="food"
        className="bb-menu"
        style={{ width: "100%", boxSizing: "border-box", padding: "80px 40px" }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto 36px",
            textAlign: "left",
          }}
        >
          <h2 style={{ color: "#fff", fontSize: "2.2rem", margin: "0 0 10px" }}>
            Dining & Beverages
          </h2>
          <p
            style={{
              color: "#d9cfb8",
              maxWidth: "560px",
              lineHeight: "1.6",
              margin: "0 0 26px",
            }}
          >
            Fresh local seafood, hot breakfast plates, and cold drinks, served
            at the bistro and on the rooftop deck.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {menuCategories.map((cat) => (
              <button
                key={cat}
                className={`bb-menu-tab${menuFilter === cat ? " active" : ""}`}
                onClick={() => setMenuFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bb-menu-grid">
          {visibleFood.map((item) => (
            <div key={item.title} className="bb-menu-card">
              <img src={item.image} alt={item.title} />
              <div className="bb-menu-shade" />
              <span className="bb-menu-badge">{item.category}</span>
              <span className="bb-menu-price">{item.price}</span>
              <div className="bb-menu-body">
                <h4 className="bb-menu-title">{item.title}</h4>
                <div className="bb-menu-line" />
                <p className="bb-menu-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "60px 40px",
          background:
            "linear-gradient(160deg, #10292a 0%, #1d3f40 55%, #2a5253 100%)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#ffffff", marginBottom: "20px" }}>Contact Us</h2>
        <div style={{ marginTop: "20px", lineHeight: "1.8", color: "#e6dcc6" }}>
          <p>
            <strong>Address:</strong> Roxas, Oriental Mindoro, Philippines
          </p>
          <p>
            <strong>Phone:</strong> +63 (043) 123-4567
          </p>
          <p>
            <strong>Email:</strong> divaahotelroxas@gmail.com
          </p>
        </div>
      </section>

      <footer
        style={{
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: "#0b1f20",
          color: "#e6dcc6",
          textAlign: "center",
          padding: "25px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} DIVAA HOTEL IN ROXAS. All rights
          reserved.
        </p>
      </footer>

      {isModalOpen && (
        <div
          className="bb-overlay"
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(8, 22, 22, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="bb-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#faf6ec",
              borderTop: "5px solid #d8b46a",
              padding: "28px",
              borderRadius: "16px",
              maxWidth: "560px",
              width: "92%",
              maxHeight: "92vh",
              overflowY: "auto",
              position: "relative",
              boxSizing: "border-box",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              colorScheme: "light",
            }}
          >
            <button
              className="bb-close"
              onClick={handleCloseModal}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                border: "none",
                background: "none",
                fontSize: "1.1rem",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ✕
            </button>

            {bookingReceipt ? (
              <div>
                <div
                  style={{
                    backgroundColor: "#e6f4ea",
                    color: "#1e6b34",
                    padding: "12px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    margin: "6px 30px 20px 0",
                    fontSize: "1.05rem",
                  }}
                >
                  Booking confirmed
                </div>

                <div
                  style={{
                    border: "1px dashed #1d3f40",
                    borderRadius: "10px",
                    padding: "20px",
                    backgroundColor: "#fffdf7",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#1d3f40" }}>
                      DIVAA HOTEL IN ROXAS
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.85rem",
                        color: "#666",
                      }}
                    >
                      Official Reservation Receipt
                    </p>
                  </div>

                  <div
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.8",
                      color: "#333",
                    }}
                  >
                    <div style={receiptRowStyle}>
                      <span>
                        <strong>Booking Reference:</strong>
                      </span>
                      <span style={{ color: "#9a7430", fontWeight: "bold" }}>
                        {bookingReceipt.id}
                      </span>
                    </div>
                    {receiptRows.map(([label, value]) => (
                      <div key={label} style={receiptRowStyle}>
                        <span>
                          <strong>{label}</strong>
                        </span>
                        <span style={{ textAlign: "right" }}>{value}</span>
                      </div>
                    ))}

                    <div
                      style={{
                        ...receiptRowStyle,
                        borderTop: "2px solid #1d3f40",
                        marginTop: "12px",
                        paddingTop: "10px",
                        fontSize: "1.1rem",
                      }}
                    >
                      <span>
                        <strong>Total Amount Paid/Due:</strong>
                      </span>
                      <span style={{ color: "#1d3f40", fontWeight: "bold" }}>
                        ₱{bookingReceipt.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.85rem",
                    color: "#666",
                    marginTop: "15px",
                  }}
                >
                  Thank you for booking with DIVAA HOTEL IN ROXAS! A
                  confirmation has been stored in your account.
                </p>

                <button
                  className="bb-submit"
                  onClick={handleCloseModal}
                  style={{ marginTop: "10px" }}
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    color: "#1d3f40",
                    fontSize: "1.5rem",
                  }}
                >
                  Reserve your stay
                </h3>
                <p
                  style={{
                    margin: "0 0 20px 0",
                    color: "#777",
                    fontSize: "0.9rem",
                  }}
                >
                  Fill in your details and pick your dates to see the total.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    padding: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e3d6b6",
                    borderRadius: "12px",
                    backgroundColor: "#f3ead7",
                  }}
                >
                  <img
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    style={{
                      width: "84px",
                      height: "68px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: "700", color: "#1d3f40" }}>
                      {selectedRoom.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#777",
                        margin: "2px 0",
                      }}
                    >
                      Up to {selectedRoom.capacity} guest
                      {selectedRoom.capacity > 1 ? "s" : ""} ·{" "}
                      {selectedRoom.bed}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "700",
                        color: "#9a7430",
                      }}
                    >
                      ₱{selectedRoom.price.toLocaleString()} / night
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitBooking}>
                  <div className="bb-field">
                    <label className="bb-label" htmlFor="guestName">
                      Full name
                    </label>
                    <input
                      id="guestName"
                      className="bb-input"
                      type="text"
                      name="guestName"
                      placeholder="Juan Dela Cruz"
                      required
                      value={formData.guestName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="bb-grid-2 bb-field">
                    <div>
                      <label className="bb-label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        id="email"
                        className="bb-input"
                        type="email"
                        name="email"
                        placeholder="name@email.com"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="bb-label" htmlFor="phone">
                        Contact number
                      </label>
                      <input
                        id="phone"
                        className="bb-input"
                        type="tel"
                        name="phone"
                        placeholder="09XX XXX XXXX"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="bb-grid-2 bb-field">
                    <div>
                      <label className="bb-label" htmlFor="roomType">
                        Room type
                      </label>
                      <select
                        id="roomType"
                        className="bb-input"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleInputChange}
                      >
                        {rooms.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name} (₱{r.price.toLocaleString()}/night)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="bb-label" htmlFor="guests">
                        Guests
                      </label>
                      <select
                        id="guests"
                        className="bb-input"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                      >
                        {Array.from(
                          { length: selectedRoom.capacity },
                          (_, i) => i + 1,
                        ).map((n) => (
                          <option key={n} value={n}>
                            {n} guest{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bb-grid-2 bb-field">
                    <div>
                      <label className="bb-label" htmlFor="checkIn">
                        Check-in
                      </label>
                      <input
                        id="checkIn"
                        className="bb-input"
                        type="date"
                        name="checkIn"
                        min={today}
                        required
                        value={formData.checkIn}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="bb-label" htmlFor="checkOut">
                        Check-out
                      </label>
                      <input
                        id="checkOut"
                        className="bb-input"
                        type="date"
                        name="checkOut"
                        min={minCheckOut}
                        required
                        value={formData.checkOut}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="bb-field">
                    <span className="bb-label">Payment method</span>
                    <div className="bb-pay-grid">
                      {paymentOptions.map((method) => (
                        <button
                          type="button"
                          key={method}
                          className={`bb-pay${formData.paymentMethod === method ? " active" : ""}`}
                          onClick={() => handleSelectPayment(method)}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bb-field">
                    <label className="bb-label" htmlFor="notes">
                      Special requests (optional)
                    </label>
                    <textarea
                      id="notes"
                      className="bb-input"
                      name="notes"
                      rows={2}
                      placeholder="Late arrival, extra pillows, etc."
                      value={formData.notes}
                      onChange={handleInputChange}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {datesValid ? (
                    <div
                      style={{
                        marginBottom: "16px",
                        padding: "14px",
                        backgroundColor: "#f3ead7",
                        borderRadius: "10px",
                        border: "1px solid #dcc99b",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.88rem",
                          color: "#555",
                          marginBottom: "6px",
                        }}
                      >
                        <span>
                          ₱{selectedRoom.price.toLocaleString()} × {nights}{" "}
                          night{nights > 1 ? "s" : ""}
                        </span>
                        <span>
                          {formatDate(formData.checkIn)} to{" "}
                          {formatDate(formData.checkOut)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #dcc99b",
                          paddingTop: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#1d3f40" }}>
                          Estimated total
                        </span>
                        <strong
                          style={{ fontSize: "1.3rem", color: "#1d3f40" }}
                        >
                          ₱{totalAmount.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: "16px",
                        padding: "14px",
                        border: "1px dashed #cdb98a",
                        borderRadius: "10px",
                        color: "#8a7a55",
                        fontSize: "0.88rem",
                        textAlign: "center",
                      }}
                    >
                      {datesChosen
                        ? "Check-out must be after your check-in date."
                        : "Choose your check-in and check-out dates to see your total."}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bb-submit"
                    disabled={!datesValid}
                  >
                    Confirm Booking
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoginOpen && !user && (
        <LoginModal
          onLogin={onLogin}
          onGoogleLogin={onGoogleLogin}
          onSignup={onSignup}
          authError={authError}
          onClose={handleCloseLogin}
        />
      )}
    </div>
  );
}
