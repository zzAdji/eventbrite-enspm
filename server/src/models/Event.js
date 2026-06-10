const mongoose = require('mongoose');

const CATEGORIES = ['Concert', 'Conférence', 'Sport', 'Atelier', 'Technologie', 'Culture', 'Design'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire.'],
      trim: true,
      maxlength: [120, 'Le titre ne peut pas dépasser 120 caractères.'],
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire.'],
      trim: true,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères.'],
    },
    eventDate: {
      type: Date,
      required: [true, 'La date est obligatoire.'],
      validate: {
        validator: (value) => value > new Date(),
        message: "La date de l'événement doit être dans le futur.",
      },
    },
    location: {
      type: String,
      required: [true, 'Le lieu est obligatoire.'],
      trim: true,
      maxlength: [80, 'Le lieu ne peut pas dépasser 80 caractères.'],
    },
    capacity: {
      type: Number,
      required: [true, 'La capacité est obligatoire.'],
      min: [1, 'La capacité doit être d\'au moins 1 place.'],
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de réservations ne peut pas être négatif.'],
    },
    category: {
      type: String,
      required: [true, 'La catégorie est obligatoire.'],
      enum: {
        values: CATEGORIES,
        message: `La catégorie doit être l'une des valeurs suivantes : ${CATEGORIES.join(', ')}.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
