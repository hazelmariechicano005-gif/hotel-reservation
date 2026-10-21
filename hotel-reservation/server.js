import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS so our React frontend can access API endpoints without errors
app.use(cors());
app.use(express.json());

// 1. Structured array of rooms matching DIVAA HOTEL theme
const hotelRooms = [
  {
    id: 101,
    roomNumber: '101',
    roomType: 'Standard Room',
    bedType: '1 Queen Bed',
    floor: '1st Floor',
    price: 1200,
    status: 'Available'
  },
  {
    id: 102,
    roomNumber: '102',
    roomType: 'Standard Room',
    bedType: '1 Queen Bed',
    floor: '1st Floor',
    price: 1200,
    status: 'Occupied'
  },
  {
    id: 201,
    roomNumber: '201',
    roomType: 'Deluxe Queen Room',
    bedType: '1 Queen Bed + Desk',
    floor: '2nd Floor',
    price: 1600,
    status: 'Available'
  },
  {
    id: 202,
    roomNumber: '202',
    roomType: 'Deluxe Queen Room',
    bedType: '1 Queen Bed + Desk',
    floor: '2nd Floor',
    price: 1600,
    status: 'Reserved'
  },
  {
    id: 301,
    roomNumber: '301',
    roomType: 'Family Suite Room',
    bedType: '2 Double Queen Beds',
    floor: '3rd Floor',
    price: 2400,
    status: 'Available'
  },
  {
    id: 302,
    roomNumber: '302',
    roomType: 'Barkada Group Room',
    bedType: '3 Bunk Beds',
    floor: '3rd Floor',
    price: 3200,
    status: 'Available'
  }
];

// 2. Structured array of Bookings (Reservations) that appear in the Admin Dashboard
let hotelBookings = [
  {
    id: 'DIVAA-821940',
    createdAt: '9/16/2026, 2:15:00 PM',
    roomName: 'Deluxe Queen Room',
    roomPrice: 1600,
    checkIn: '2026-09-17',
    checkOut: '2026-09-19',
    nights: 2,
    adults: 2,
    children: 0,
    guestName: 'Maria Santos',
    guestEmail: 'maria.santos@gmail.com',
    guestPhone: '+63 917 888 1234',
    specialRequests: 'Near window, quiet room',
    totalPrice: 3200,
    status: 'Confirmed'
  },
  {
    id: 'DIVAA-491203',
    createdAt: '9/16/2026, 11:30:00 AM',
    roomName: 'Family Suite Room',
    roomPrice: 2400,
    checkIn: '2026-09-18',
    checkOut: '2026-09-20',
    nights: 2,
    adults: 3,
    children: 1,
    guestName: 'Juan Dela Cruz',
    guestEmail: 'juan.delacruz@yahoo.com',
    guestPhone: '+63 918 555 9876',
    specialRequests: 'Early check-in if possible',
    totalPrice: 4800,
    status: 'Checked In'
  }
];

// GET: /api/data - Returns rooms inventory
app.get('/api/data', (req, res) => {
  res.json(hotelRooms);
});

// GET: /api/bookings - Returns all reservations for the Admin Dashboard
app.get('/api/bookings', (req, res) => {
  res.json(hotelBookings);
});

// POST: /api/bookings - When a user completes booking, it saves here and appears in Admin!
app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: req.body.id || 'DIVAA-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: req.body.createdAt || new Date().toLocaleString(),
    roomName: req.body.roomName || 'Standard Room',
    roomPrice: req.body.roomPrice || 1200,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
    nights: req.body.nights || 1,
    adults: req.body.adults || 1,
    children: req.body.children || 0,
    guestName: req.body.guestName || 'Anonymous Guest',
    guestEmail: req.body.guestEmail || 'guest@example.com',
    guestPhone: req.body.guestPhone || '',
    specialRequests: req.body.specialRequests || '',
    totalPrice: req.body.totalPrice || 1200,
    status: req.body.status || 'Confirmed'
  };

  // Prepend to top of list so newest booking appears first in Admin
  hotelBookings.unshift(newBooking);
  console.log(`[New Booking Received] ${newBooking.id} by ${newBooking.guestName} (${newBooking.roomName})`);
  res.status(201).json(newBooking);
});

// PATCH: /api/bookings/:id/status - Update reservation status (Checked In, Checked Out, Cancelled)
app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = hotelBookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = status;
  console.log(`[Status Updated] ${id} -> ${status}`);
  res.json(booking);
});

// DELETE: /api/bookings/:id - Delete a reservation
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  hotelBookings = hotelBookings.filter((b) => b.id !== id);
  console.log(`[Booking Deleted] ${id}`);
  res.json({ message: 'Booking removed successfully', id });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`🏨 DIVAA HOTEL Express Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔗 Rooms API: http://localhost:${PORT}/api/data`);
  console.log(`📋 Admin Bookings API: http://localhost:${PORT}/api/bookings`);
  console.log(`================================================`);
});
