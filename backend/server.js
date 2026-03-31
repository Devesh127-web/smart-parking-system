const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const mallRoutes    = require('./routes/malls');
const slotRoutes    = require('./routes/slots');
const bookingRoutes = require('./routes/bookings');
const adminRoutes   = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/malls',    mallRoutes);
app.use('/api/slots',    slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin',    adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date().toISOString() }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
