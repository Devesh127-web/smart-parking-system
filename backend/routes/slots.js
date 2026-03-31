const router       = require('express').Router();
const db           = require('../config/db');
const authenticate = require('../middleware/auth');

// GET /api/slots/:mallId
router.get('/:mallId', authenticate, async (req, res) => {
  try {
    const { mallId } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM slots WHERE mall_id = ? ORDER BY slot_number',
      [mallId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', details: err.message });
  }
});

module.exports = router;
