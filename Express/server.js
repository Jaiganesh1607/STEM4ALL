require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Basic middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Static files for certificates or assets
app.use('/public', express.static(path.join(__dirname, 'public')));

// Auth routes (ADD THIS LINE)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Instructor module routes
const instructorRoutes = require('./routes/instructorRoutes');
app.use('/api/instructor', instructorRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
