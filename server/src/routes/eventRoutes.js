const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  reserveTicket,
} = require('../controllers/eventController');
const asyncHandler = require('../middleware/asyncHandler');
const {
  validate,
  eventIdParam,
  createEventRules,
  reserveTicketRules,
  getEventsQueryRules,
} = require('../middleware/validator');

router.post('/', createEventRules, validate, asyncHandler(createEvent));
router.get('/', getEventsQueryRules, validate, asyncHandler(getEvents));
router.get('/:id', eventIdParam, validate, asyncHandler(getEventById));
router.post('/:id/tickets', eventIdParam, reserveTicketRules, validate, asyncHandler(reserveTicket));

module.exports = router;
