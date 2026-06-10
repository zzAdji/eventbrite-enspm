/**
 * Middleware global de gestion des erreurs.
 * Normalise toutes les réponses d'erreur au format JSON standardisé.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Erreurs métier personnalisées (ticketService, controllers)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'SERVER_ERROR',
        message: err.message,
      },
    });
  }

  // ID MongoDB invalide ou document introuvable
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: { code: 'EVENT_NOT_FOUND', message: "Événement introuvable." },
    });
  }

  // Validation Mongoose (schéma)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: messages.join(' ') },
    });
  }

  // Doublon (ex. reservationCode unique)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: { code: 'DUPLICATE_ERROR', message: 'Cette ressource existe déjà.' },
    });
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl} —`, err.message);

  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Une erreur interne est survenue.' },
  });
};

module.exports = errorHandler;
