const express = require('express');
const router = express.Router();
const { getTicketsByEvent } = require('../controllers/ticketController');
const asyncHandler = require('../middleware/asyncHandler');
const { eventIdParam, validate } = require('../middleware/validator');

router.get('/:id/tickets', eventIdParam, validate, asyncHandler(getTicketsByEvent));

module.exports = router;
