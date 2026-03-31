const router     = require('express').Router();
const db         = require('../config/db');
const authenticate = require('../middleware/auth');

// GET /api/malls — returns all malls with available/total slot counts
router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        m.id, m.name, m.address, m.tenant_id,
        COUNT(s.id)                                         AS total_slots,
        SUM(s.status = 'available')                         AS available_slots
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
