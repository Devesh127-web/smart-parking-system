const router       = require('express').Router();
const db           = require('../config/db');
const authenticate = require('../middleware/auth');

// Role guard — admin only
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Admin access required' });
  next();
}

// GET /api/admin/stats
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const [[{ totalMalls }]]     = await db.execute('SELECT COUNT(*) AS totalMalls FROM malls');
    const [[{ bookingsToday }]]  = await db.execute(
      "SELECT COUNT(*) AS bookingsToday FROM bookings WHERE DATE(start_time) = CURDATE()"
    );
    const [[{ availableSlots }]] = await db.execute(
      "SELECT COUNT(*) AS availableSlots FROM slots WHERE status = 'available'"
    );
    const [[{ totalUsers }]]     = await db.execute('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalBookings }]]  = await db.execute('SELECT COUNT(*) AS totalBookings FROM bookings');

    res.json({ totalMalls, bookingsToday, availableSlots, totalUsers, totalBookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', authenticate, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        b.id,
        COALESCE(u.name, 'Guest') AS user_name,
        m.name                    AS mall_name,
        s.slot_number,
        b.start_time,
        b.end_time,
        s.status
      FROM bookings b
      JOIN  slots s ON b.slot_id  = s.id
      JOIN  malls m ON s.mall_id  = m.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.start_time DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

// GET /api/admin/malls — malls with slot breakdown
router.get('/malls', authenticate, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        m.id, m.name, m.address,
        COUNT(s.id)                         AS total_slots,
        SUM(s.status = 'available')         AS available_slots,
        SUM(s.status = 'booked')            AS booked_slots
      FROM malls m
      LEFT JOIN slots s ON s.mall_id = m.id
      GROUP BY m.id
      ORDER BY m.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch malls', details: err.message });
  }
});

module.exports = router;
