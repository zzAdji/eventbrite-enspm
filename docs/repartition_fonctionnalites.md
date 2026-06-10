# Répartition des Fonctionnalités par Développeur

Afin de simplifier le flux de travail, **chaque membre de l'équipe travaillera sur une seule et unique branche** qui lui est propre. Les fusions (merges) vers `develop` ou `main` se feront régulièrement.

Voici le détail exact des fichiers à créer ou à modifier pour chaque membre.

---

## 1. BE-Lead (Back-end & Intégration)
**Branche unique :** `feat/be-lead`

**Fichiers à créer / modifier :**
- `server/src/config/db.js` (Nouveau : Connexion MongoDB)
- `server/src/models/Event.js` (Nouveau : Schéma Mongoose pour les événements)
- `server/src/models/Ticket.js` (Nouveau : Schéma Mongoose pour les billets)
- `server/src/routes/eventRoutes.js` (Nouveau : Routes POST/GET pour événements)
- `server/src/controllers/eventController.js` (Nouveau : Logique CRUD événements)
- `server/src/services/ticketService.js` (Nouveau : Logique de réservation critique, contrôle capacité, génération ID)
- `server/src/services/reservationCodeService.js` (Nouveau : Algorithme EVT-XXXXXX)
- `docs/postman/EventBrite.postman_collection.json` (Nouveau : Export Postman)

---

## 2. BE-Dev (Back-end)
**Branche unique :** `feat/be-dev`

**Fichiers à créer / modifier :**
- `server/.env.example` (Nouveau : Variables d'environnement)
- `server/src/middleware/errorHandler.js` (Nouveau : Gestion globale des erreurs)
- `server/src/middleware/asyncHandler.js` (Nouveau : Wrapper try/catch)
- `server/src/middleware/validator.js` (Nouveau : express-validator pour les requêtes)
- `server/src/routes/ticketRoutes.js` (Nouveau : Route `GET /api/events/:id/tickets`)
- `server/src/controllers/ticketController.js` (Nouveau : Récupération des billets d'un événement)
- `server/package.json` (Modification : Ajout des scripts `dev`, `start`)
- *Aide sur `server/src/controllers/eventController.js` pour ajouter la recherche, la pagination et les filtres.*

---

## 3. FE-Lead (Front-end)
**Branche unique :** `feat/fe-lead`

**Fichiers à créer / modifier :**
- `client/src/styles/tokens.css` (Nouveau : Variables CSS, couleurs, fonts)
- `client/src/index.css` (Modification : Import des tokens, reset CSS)
- `client/src/App.jsx` (Modification : Configuration globale du React Router)
- `client/src/components/layout/Navbar.jsx` (Nouveau : Barre de navigation)
- `client/src/components/layout/Layout.jsx` (Nouveau : Wrapper de page)
- `client/src/components/ui/Button.jsx` (Nouveau : Composant bouton réutilisable)
- `client/src/components/ui/Input.jsx` (Nouveau : Composant input réutilisable)
- `client/src/pages/CreateEvent.jsx` (Nouveau : Page avec le formulaire de création)

---

## 4. FE-Dev 1 (Front-end)
**Branche unique :** `feat/fe-dev-1`

**Fichiers à créer / modifier :**
- `client/src/components/events/EventCard.jsx` (Nouveau : Carte d'un événement)
- `client/src/components/events/CategoryFilter.jsx` (Nouveau : Filtres horizontaux)
- `client/src/components/events/ProgressBar.jsx` (Nouveau : Jauge de capacité)
- `client/src/pages/HomePage.jsx` (Nouveau : Page d'accueil avec vue héro)
- `client/src/pages/EventCatalog.jsx` (Nouveau : Grille du catalogue avec appel API `GET /api/events`)
- `client/src/pages/Dashboard.jsx` (Nouveau : Tableau de bord organisateur)

---

## 5. FE-Dev 2 (Front-end)
**Branche unique :** `feat/fe-dev-2`

**Fichiers à créer / modifier :**
- `client/.env.example` (Nouveau : `VITE_API_URL`)
- `client/src/api/client.js` (Nouveau : Instance Axios configurée)
- `client/src/api/events.js` (Nouveau : Fonctions d'appels API événements)
- `client/src/api/tickets.js` (Nouveau : Fonctions d'appels API billets)
- `client/src/components/booking/BookingModal.jsx` (Nouveau : Fenêtre modale de réservation)
- `client/src/pages/EventDetail.jsx` (Nouveau : Page détail de l'événement branchée sur `GET /api/events/:id`)
- `client/src/pages/TicketSuccess.jsx` (Nouveau : Affichage final du billet et QR Code)
- `client/src/pages/MyTickets.jsx` (Nouveau : Liste des billets de l'utilisateur)
