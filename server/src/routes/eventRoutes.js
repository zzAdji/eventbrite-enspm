const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  reserveTicket,
} = require('../controllers/eventController');

// Événements
router.post('/', createEvent);          // POST  /api/events
router.get('/', getEvents);             // GET   /api/events
router.get('/:id', getEventById);       // GET   /api/events/:id

// Réservation
router.post('/:id/tickets', reserveTicket);

module.exports = router;
