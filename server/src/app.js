const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Middlewares de base
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Serveur opérationnel' });
});

app.use('/api/events', eventRoutes);

// Route inconnue (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route introuvable.' },
  });
});

module.exports = app;
