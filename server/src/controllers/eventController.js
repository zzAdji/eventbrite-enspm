const Event = require('../models/Event');
const { bookTicket } = require('../services/ticketService');

// ──────────────────────────────────────────────
// POST /api/events — Créer un événement
// ──────────────────────────────────────────────
const createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ success: true, data: event });
};

// ──────────────────────────────────────────────
// GET /api/events — Lister les événements à venir
// Supporte : ?category=, ?search=, ?page=, ?limit=
// ──────────────────────────────────────────────
const getEvents = async (req, res) => {
  const { category, search, page = 1, limit = 6 } = req.query;

  const filter = {
    eventDate: { $gte: new Date() },
  };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    Event.find(filter).sort({ eventDate: 1 }).skip(skip).limit(limitNum),
    Event.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
};

// ──────────────────────────────────────────────
// GET /api/events/:id — Détail d'un événement
// ──────────────────────────────────────────────
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    const error = new Error("Événement introuvable.");
    error.statusCode = 404;
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  res.status(200).json({ success: true, data: event });
};

// ──────────────────────────────────────────────
// POST /api/events/:id/tickets — Réserver une place
// ──────────────────────────────────────────────
const reserveTicket = async (req, res) => {
  const { studentName, studentId } = req.body;
  const ticket = await bookTicket(req.params.id, studentName.trim(), studentId.trim());
  res.status(201).json({ success: true, data: ticket });
};

module.exports = { createEvent, getEvents, getEventById, reserveTicket };
