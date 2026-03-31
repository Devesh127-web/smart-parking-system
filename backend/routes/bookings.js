const router       = require('express').Router();
const db           = require('../config/db');
const authenticate = require('../middleware/auth');

// POST /api/bookings — create a booking
router.post('/', authenticate, async (req, res) => {
  const { slotId, startTime, endTime } = req.body;
  if (!slotId || !startTime || !endTime)
    return res.status(400).json({ error: 'slotId, startTime, and endTime are required' });

  try {
    // Check slot is still available
    const [[slot]] = await db.execute(
      "SELECT id, status FROM slots WHERE id = ?", [slotId]
    );
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.status !== 'available')
      return res.status(409).json({ error: 'Slot is already booked' });

    // Mark slot booked
    await db.execute("UPDATE slots SET status = 'booked' WHERE id = ?", [slotId]);

    // Insert booking with user_id
    await db.execute(
      'INSERT INTO bookings (user_id, slot_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [req.user.id, slotId, startTime, endTime]
    );

    res.json({ message: 'Booking confirmed' });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed', details: err.message });
  }
});

// GET /api/bookings/mine — get current user's bookings
router.get('/mine', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        b.id, b.start_time, b.end_time,
        m.name  AS mall_name,
        s.slot_number, s.status
      FROM bookings b
      JOIN slots s ON b.slot_id  = s.id
      JOIN malls m ON s.mall_id  = m.id
      WHERE b.user_id = ?
      ORDER BY b.start_time DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// DELETE /api/bookings/:id — cancel a booking (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [[booking]] = await db.execute(
      'SELECT id, slot_id FROM bookings WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found or not yours' });

    await db.execute('DELETE FROM bookings WHERE id = ?', [booking.id]);
    await db.execute("UPDATE slots SET status = 'available' WHERE id = ?", [booking.slot_id]);

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Cancel failed', details: err.message });
  }
});

// GET /api/bookings — admin: all bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM bookings ORDER BY start_time DESC LIMIT 100'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

module.exports = router;
