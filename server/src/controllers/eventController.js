const Event = require('../models/Event');
const { bookTicket } = require('../services/ticketService');

// ──────────────────────────────────────────────
// POST /api/events — Créer un événement
// ──────────────────────────────────────────────
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: messages.join(' ') },
      });
    }
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

// ──────────────────────────────────────────────
// GET /api/events — Lister les événements à venir
// Supporte : ?category=, ?search=, ?page=, ?limit=
// ──────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;

    const filter = {
      eventDate: { $gte: new Date() }, // Uniquement les événements à venir
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

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

// ──────────────────────────────────────────────
// GET /api/events/:id — Détail d'un événement
// ──────────────────────────────────────────────
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: { code: 'EVENT_NOT_FOUND', message: "Événement introuvable." },
      });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    // ID MongoDB mal formé
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: { code: 'EVENT_NOT_FOUND', message: "Événement introuvable." },
      });
    }
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message },
    });
  }
};

// ──────────────────────────────────────────────
// POST /api/events/:id/tickets — Réserver une place
// La logique critique est dans ticketService
// ──────────────────────────────────────────────
const reserveTicket = async (req, res) => {
  try {
    const { studentName, studentId } = req.body;

    if (!studentName || !studentId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Le nom et le matricule sont obligatoires.' },
      });
    }

    const ticket = await bookTicket(req.params.id, studentName.trim(), studentId.trim());

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: error.code || 'SERVER_ERROR', message: error.message },
    });
  }
};

module.exports = { createEvent, getEvents, getEventById, reserveTicket };
