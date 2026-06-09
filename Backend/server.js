//
//  CONFIGURATION ET VARIABLES D'ENVIRONNEMENT
//
require("dotenv").config();
const express = require("express");
const app = express();

// Permet à Express de lire le JSON dans le corps des requêtes
app.use(express.json());

const PORT = process.env.PORT || 3000;

//
// SIMULATION DE BASE DE DONNÉES (MOCK DATA)
//
const fakeTicketsDatabase = [
  { id: 1, eventId: 1, type: "Standard", price: 25, available: true },
  { id: 2, eventId: 1, type: "VIP", price: 75, available: true },
  { id: 3, eventId: 1, type: "Standard", price: 25, available: false },
  { id: 4, eventId: 1, type: "Standard", price: 20, available: true },
  { id: 5, eventId: 1, type: "VIP", price: 90, available: false },
  { id: 6, eventId: 2, type: "VIP", price: 100, available: true },
  { id: 7, eventId: 2, type: "Standard", price: 30, available: true },
];

//
//  MIDDLEWARES DE VALIDATION
//
const validateEventId = (req, res, next) => {
  const eventId = req.params.id;
  if (isNaN(eventId)) {
    const error = new Error(
      "Validation échouée : L'ID de l'événement doit être un nombre valide.",
    );
    error.status = 400; // 400 = Bad Request
    return next(error);
  }
  next();
};

//
//  ROUTES DE L'API
//

// Route d'accueil
app.get("/", (req, res) => {
  res.json({ message: "Le backend Node.js fonctionne parfaitement !" });
});

// --- GET /events/:id/tickets (Avec filtres et pagination) ---
app.get("/events/:id/tickets", validateEventId, (req, res, next) => {
  const eventIdRequested = parseInt(req.params.id);

  // Filtrage par l'ID de l'événement
  let results = fakeTicketsDatabase.filter(
    (ticket) => ticket.eventId === eventIdRequested,
  );

  // Si aucun ticket n'existe pour cet événement (ex: événement 99)
  if (results.length === 0) {
    const error = new Error(
      `Aucun ticket trouvé pour l'événement avec l'ID ${eventIdRequested}.`,
    );
    error.status = 404; // 404 = Not Found
    return next(error);
  }

  // Filtre par Type (?type=VIP ou ?type=Standard)
  if (req.query.type) {
    const typeRequested = req.query.type.trim().toLowerCase();
    results = results.filter(
      (ticket) => ticket.type.trim().toLowerCase() === typeRequested,
    );
  }

  // Filtre par Disponibilité (?available=true ou ?available=false)
  if (req.query.available) {
    const isAvailable = req.query.available.trim().toLowerCase() === "true";
    results = results.filter((ticket) => ticket.available === isAvailable);
  }

  // Logique de Pagination (?page=1&limit=2)
  const totalTicketsFound = results.length;

  const page = parseInt(req.query.page) || 1;
  // Si aucune limite n'est fournie, on affiche tout d'un coup
  const limit = req.query.limit ? parseInt(req.query.limit) : totalTicketsFound;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedResults = results.slice(startIndex, endIndex);

  // Envoi de la réponse structurée
  res.json({
    success: true,
    meta: {
      totalItems: totalTicketsFound,
      currentPage: page,
      itemsPerPage: limit,
      totalPages: limit > 0 ? Math.ceil(totalTicketsFound / limit) : 1,
    },
    tickets: paginatedResults,
  });
});

//
// MIDDLEWARE DE GESTION GLOBALE DES ERREURS
//
app.use((err, req, res, next) => {
  console.error("💥 Erreur :", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Une erreur interne est survenue.",
  });
});

//
// LANCEMENT DU SERVEUR
//
app.listen(PORT, () => {
  console.log(`Serveur démarré sur : http://localhost:${PORT}`);
});
