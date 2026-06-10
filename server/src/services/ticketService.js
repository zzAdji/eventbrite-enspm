const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const { generateReservationCode } = require('./reservationCodeService');

/**
 * Réserve une place pour un participant sur un événement.
 * @param {string} eventId
 * @param {string} studentName
 * @param {string} studentId
 * @returns {Promise<Object>}
 */
const bookTicket = async (eventId, studentName, studentId) => {
  // 1. Vérifier existence de l'événement
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error("Événement introuvable.");
    error.statusCode = 404;
    error.code = 'EVENT_NOT_FOUND';
    throw error;
  }

  // 2. Vérifier la capacité
  if (event.bookedCount >= event.capacity) {
    const error = new Error("Cet événement est complet.");
    error.statusCode = 400;
    error.code = 'EVENT_FULL';
    throw error;
  }

  // 3. Générer un code unique avec retry automatique en cas de collision
  let reservationCode;
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (attempts < MAX_ATTEMPTS) {
    reservationCode = generateReservationCode();
    const existing = await Ticket.findOne({ reservationCode });
    if (!existing) break;
    attempts++;
  }

  if (attempts === MAX_ATTEMPTS) {
    const error = new Error("Impossible de générer un code de réservation unique. Veuillez réessayer.");
    error.statusCode = 500;
    error.code = 'CODE_GENERATION_FAILED';
    throw error;
  }

  // 4. Créer le billet
  const ticket = await Ticket.create({
    eventId,
    studentName,
    studentId,
    reservationCode,
  });

  // 5. Incrémenter atomiquement bookedCount
  await Event.findByIdAndUpdate(eventId, { $inc: { bookedCount: 1 } });

  return ticket;
};

module.exports = { bookTicket };
