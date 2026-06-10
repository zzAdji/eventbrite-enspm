const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, "L'identifiant de l'événement est obligatoire."],
    },
    studentName: {
      type: String,
      required: [true, 'Le nom du participant est obligatoire.'],
      trim: true,
      maxlength: [80, 'Le nom ne peut pas dépasser 80 caractères.'],
    },
    studentId: {
      type: String,
      required: [true, 'Le matricule est obligatoire.'],
      trim: true,
    },
    reservationCode: {
      type: String,
      required: [true, 'Le code de réservation est obligatoire.'],
      unique: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.index({ reservationCode: 1 }, { unique: true });

module.exports = mongoose.model('Ticket', ticketSchema);
