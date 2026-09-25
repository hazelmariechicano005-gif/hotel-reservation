import { useEffect, useMemo, useState } from 'react'

const API_URL = 'http://localhost:5000'

export default function HotelInfo({ user, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ checkIn: '', checkOut: '', adults: 1, children: 0, phone: '', specialRequests: '' })

  async function loadRooms() {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/data`)
      if (!response.ok) throw new Error('Unable to load rooms.')
      const data = await response.json()
      setRooms(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('Cannot connect to the room reservation server. Start server.js on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRooms() }, [])

  const availableRooms = useMemo(() => rooms.filter((room) => String(room.status).toLowerCase() === 'available'), [rooms])

  function openBooking(room) {
    setSelectedRoom(room)
    setMessage('')
    setError('')
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function calculateNights() {
    if (!form.checkIn || !form.checkOut) return 0
    const start = new Date(`${form.checkIn}T00:00:00`)
    const end = new Date(`${form.checkOut}T00:00:00`)
    const nights = Math.ceil((end - start) / 86400000)
    return nights > 0 ? nights : 0
  }

  async function submitBooking(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const nights = calculateNights()
    if (!nights) {
      setError('Check-out must be after check-in.')
      return
    }

    const totalPrice = Number(selectedRoom.price) * nights
    setSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          roomName: selectedRoom.roomType,
          roomNumber: selectedRoom.roomNumber,
          roomPrice: selectedRoom.price,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          nights,
          adults: Number(form.adults),
          children: Number(form.children),
          guestName: user?.name || 'Customer',
          guestEmail: user?.email || '',
          guestPhone: form.phone,
          specialRequests: form.specialRequests,
          totalPrice,
          status: 'Confirmed',
        }),
      })

      if (!response.ok) throw new Error('Reservation could not be submitted.')

      const booking = await response.json()
      setMessage(`Reservation ${booking.id} confirmed. Total: ₱${Number(booking.totalPrice).toLocaleString()}`)
      setSelectedRoom(null)
      setForm({ checkIn: '', checkOut: '', adults: 1, children: 0, phone: '', specialRequests: '' })
    } catch (err) {
      console.error(err)
      setError('Unable to submit reservation. Please check that the server is running.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-3 px-md-4 py-3 sticky-top">
        <span className="navbar-brand fw-bold">DIVAA HOTEL</span>
        <div className="ms-auto d-flex align-items-center gap-2">
          <span className="text-white small d-none d-md-inline">Welcome, {user?.name}</span>
          <button className="btn btn-outline-light btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <header className="text-white py-5" style={{ background: 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.6)), url(https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=80) center/cover' }}>
        <div className="container py-5">
          <span className="text-uppercase fw-bold small" style={{ letterSpacing: 2 }}>DIVAA HOTEL • ROXAS, ORIENTAL MINDORO</span>
          <h1 className="display-4 fw-bold mt-2">Comfortable rooms for your next stay.</h1>
          <p className="lead mb-0" style={{ maxWidth: 700 }}>Browse our rooms and reserve your stay directly through the hotel reservation system.</p>
        </div>
      </header>

      <main className="container py-5">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
          <div><div className="text-warning fw-bold small text-uppercase">Our Rooms</div><h2 className="fw-bold mb-1">Choose your room</h2><p className="text-muted mb-0">Reserve a room using your customer account.</p></div>
          <button className="btn btn-outline-dark" onClick={loadRooms}>Refresh Rooms</button>
        </div>

        {loading ? <div className="text-center py-5"><div className="spinner-border" /></div> : (
          <div className="row g-4">
            {rooms.map((room) => {
              const available = String(room.status).toLowerCase() === 'available'
              return (
                <div className="col-md-6 col-xl-4" key={room.id}>
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">
                    <img src={room.image || getRoomImage(room.roomType)} alt={room.roomType} className="card-img-top" style={{ height: 210, objectFit: 'cover' }} />
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between gap-2"><h5 className="fw-bold mb-1">{room.roomType}</h5><span className={`badge ${available ? 'text-bg-success' : 'text-bg-secondary'}`}>{room.status}</span></div>
                      <p className="text-muted small mb-2">Room {room.roomNumber} • {room.bedType} • {room.floor}</p>
                      <div className="fs-4 fw-bold mb-3">₱{Number(room.price).toLocaleString()} <span className="fs-6 text-muted fw-normal">/ night</span></div>
                      <button className="btn btn-dark mt-auto" disabled={!available} onClick={() => openBooking(room)}>{available ? 'Reserve this room' : 'Not available'}</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && availableRooms.length === 0 && <div className="alert alert-warning mt-4">There are currently no available rooms.</div>}
      </main>

      {selectedRoom && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,.65)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header"><div><h5 className="modal-title fw-bold">Reserve {selectedRoom.roomType}</h5><small className="text-muted">Room {selectedRoom.roomNumber} • ₱{Number(selectedRoom.price).toLocaleString()}/night</small></div><button className="btn-close" onClick={() => setSelectedRoom(null)} /></div>
              <form onSubmit={submitBooking}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6"><label className="form-label fw-semibold">Check-in</label><input type="date" name="checkIn" className="form-control" value={form.checkIn} onChange={updateForm} required min={today()} /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Check-out</label><input type="date" name="checkOut" className="form-control" value={form.checkOut} onChange={updateForm} required min={form.checkIn || today()} /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Adults</label><input type="number" name="adults" className="form-control" min="1" value={form.adults} onChange={updateForm} required /></div>
                    <div className="col-md-6"><label className="form-label fw-semibold">Children</label><input type="number" name="children" className="form-control" min="0" value={form.children} onChange={updateForm} /></div>
                    <div className="col-12"><label className="form-label fw-semibold">Phone Number</label><input type="tel" name="phone" className="form-control" value={form.phone} onChange={updateForm} required placeholder="09XXXXXXXXX" /></div>
                    <div className="col-12"><label className="form-label fw-semibold">Special Requests</label><textarea name="specialRequests" className="form-control" rows="3" value={form.specialRequests} onChange={updateForm} placeholder="Optional" /></div>
                  </div>
                  <div className="alert alert-light border mt-4 mb-0"><div className="d-flex justify-content-between"><span>Number of nights</span><strong>{calculateNights() || 0}</strong></div><div className="d-flex justify-content-between mt-2"><span>Total</span><strong>₱{(Number(selectedRoom.price) * calculateNights()).toLocaleString()}</strong></div></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedRoom(null)}>Cancel</button><button className="btn btn-dark" disabled={submitting}>{submitting ? 'Submitting...' : 'Confirm Reservation'}</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function getRoomImage(roomType) {
  if (roomType?.includes('Family')) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
  if (roomType?.includes('Barkada')) return 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80'
  return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'
}
