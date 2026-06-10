const { body, param, query, validationResult } = require('express-validator');

const CATEGORIES = ['Concert', 'Conférence', 'Sport', 'Atelier', 'Technologie', 'Culture', 'Design'];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: errors.array().map((e) => e.msg).join(' '),
      },
    });
  }
  next();
};

const eventIdParam = [
  param('id')
    .isMongoId()
    .withMessage("Identifiant d'événement invalide."),
];

const createEventRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est obligatoire.')
    .isLength({ max: 120 })
    .withMessage('Le titre ne peut pas dépasser 120 caractères.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est obligatoire.')
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères.'),
  body('eventDate')
    .notEmpty()
    .withMessage('La date est obligatoire.')
    .isISO8601()
    .withMessage('La date doit être au format ISO 8601.')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("La date de l'événement doit être dans le futur.");
      }
      return true;
    }),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Le lieu est obligatoire.')
    .isLength({ max: 80 })
    .withMessage('Le lieu ne peut pas dépasser 80 caractères.'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('La capacité doit être un entier d\'au moins 1.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La catégorie est obligatoire.')
    .isIn(CATEGORIES)
    .withMessage(`La catégorie doit être l'une des valeurs suivantes : ${CATEGORIES.join(', ')}.`),
];

const reserveTicketRules = [
  body('studentName')
    .trim()
    .notEmpty()
    .withMessage('Le nom du participant est obligatoire.')
    .isLength({ max: 80 })
    .withMessage('Le nom ne peut pas dépasser 80 caractères.'),
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Le matricule est obligatoire.'),
];

const getEventsQueryRules = [
  query('category')
    .optional()
    .isIn(CATEGORIES)
    .withMessage(`La catégorie doit être l'une des valeurs suivantes : ${CATEGORIES.join(', ')}.`),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La recherche ne peut pas dépasser 100 caractères.'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La limite doit être un entier entre 1 et 50.'),
];

module.exports = {
  validate,
  eventIdParam,
  createEventRules,
  reserveTicketRules,
  getEventsQueryRules,
};
