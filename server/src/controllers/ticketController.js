const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// ──────────────────────────────────────────────
// GET /api/events/:id/tickets — Lister les billets d'un événement
// ──────────────────────────────────────────────
const getTicketsByEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    const error = new Error("Événement introuvable.");
    error.statusCode = 404;
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  const tickets = await Ticket.find({ eventId: req.params.id }).sort({ bookingDate: -1 });

  res.status(200).json({ success: true, data: tickets });
};

module.exports = { getTicketsByEvent };
