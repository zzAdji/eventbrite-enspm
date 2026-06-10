/**
 * Génère un code de réservation unique au format EVT-XXXXXX
 */
const generateReservationCode = () => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVT-${code}`;
};

module.exports = { generateReservationCode };
