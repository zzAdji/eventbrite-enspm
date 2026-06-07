# EventBrite — Architecture Technique

**Version** 1.0 · **Projet** ENSPM — INFOTEL · **Année académique** 2025/2026

---

## 1. Vision architecturale

EventBrite est une application web full-stack de billetterie événementielle. L'architecture repose sur une séparation nette entre présentation, logique métier et persistance — trois couches indépendantes, testables et évolutives.

Le principe directeur est simple : **le serveur est la source de vérité**. Toute règle métier critique — contrôle de capacité, génération de codes de réservation, validation des données — s'exécute exclusivement côté back-end. Le front-end reflète l'état du serveur ; il ne le remplace jamais.

```
┌─────────────────────────────────────────────────────────────┐
│                     Navigateur (React)                       │
│  Pages · Composants · Design System · React Router           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST · JSON
┌──────────────────────────▼──────────────────────────────────┐
│                  API Express (Node.js)                       │
│  Routes · Validation · Logique métier · Gestion d'erreurs    │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────┐
│                      MongoDB                                 │
│  Collections Event · Ticket                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Structure du dépôt

```
eventbrite-enspm/
├── client/                     # Application React (Vite)
│   ├── public/                 # Assets statiques (images, favicon)
│   ├── src/
│   │   ├── api/                # Couche d'accès aux endpoints REST
│   │   ├── assets/             # Illustrations, icônes, images de catégories
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── layout/         # Navbar, Footer, Layout
│   │   │   ├── events/         # EventCard, CategoryFilter, ProgressBar
│   │   │   └── booking/        # BookingModal
│   │   ├── pages/              # Écrans routés (une page = un fichier)
│   │   ├── hooks/              # Hooks personnalisés (fetch, pagination, filtres)
│   │   ├── styles/             # Variables CSS, tokens du design system
│   │   ├── utils/              # Helpers (formatage dates, calcul places restantes)
│   │   ├── App.jsx             # Point d'entrée des routes
│   │   └── main.jsx            # Bootstrap React
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # API REST Express
│   ├── src/
│   │   ├── config/             # Connexion MongoDB, variables d'environnement
│   │   ├── controllers/        # Handlers HTTP par ressource
│   │   ├── middleware/         # Validation, gestion d'erreurs, async wrapper
│   │   ├── models/             # Schémas Mongoose (Event, Ticket)
│   │   ├── routes/             # Définition des routes REST
│   │   ├── services/           # Logique métier (réservation, génération de code)
│   │   ├── utils/              # Helpers serveur (generateReservationCode)
│   │   └── app.js              # Configuration Express + montage des routes
│   ├── index.js                # Point d'entrée serveur
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── Eventix_Cahier_des_Charges.pdf
│   ├── architecture.md         # Ce document
│   └── plan.md                   # Répartition des tâches et planning
│
├── README.md
└── LICENSE
```

> **Convention de nommage.** Le cahier des charges référence `/frontend` et `/backend`. Le dépôt utilise `client/` et `server/` — sémantiquement équivalents, choix délibéré pour la clarté dans un monorepo.

---

## 3. Stack technologique

### 3.1 Runtime et outillage

| Composant | Technologie | Version cible |
|-----------|-------------|---------------|
| Runtime | Node.js | ≥ 18 LTS |
| Gestionnaire de paquets | npm | ≥ 9 |
| Contrôle de version | Git | — |

### 3.2 Back-end — installé

| Package | Version | Rôle |
|---------|---------|------|
| `express` | ^5.2 | Framework HTTP, routage REST |
| `mongoose` | ^9.6 | ODM MongoDB, schémas et validation |
| `cors` | ^2.8 | Autorisation des requêtes cross-origin depuis le client Vite |
| `dotenv` | ^17.4 | Chargement des variables d'environnement |
| `nodemon` | ^3.1 | Rechargement automatique en développement |
| `express-validator` |  | Validation des corps de requête (POST events, POST tickets) |
| `helmet` |  | En-têtes HTTP de sécurité |
| `morgan` |  | Journalisation des requêtes en développement |


### 3.3 Front-end — installé

| Package | Version | Rôle |
|---------|---------|------|
| `react` | ^19.2 | Bibliothèque UI |
| `react-dom` | ^19.2 | Rendu DOM |
| `vite` | ^8.0 | Bundler et serveur de développement |
| `@vitejs/plugin-react` | ^6.0 | Support JSX/ Fast Refresh |
| `eslint` + plugins | ^10 | Analyse statique du code |
| `react-router-dom` |  | Routage SPA (`/`, `/events`, `/events/:id`, etc.) |
| `axios` |  | Client HTTP typé vers l'API REST |
| `qrcode.react` |  | Génération du QR code sur le billet numérique |
| `react-barcode` ou `jsbarcode` |  | Code-barres sur TicketSuccess |
| `@fontsource/inter` |  | Typographie Inter (équivalent web de SF Pro) |

---

## 4. Modèle de données

### 4.1 Collection `Event`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `title` | String | Requis, max 120 | Titre de l'événement |
| `description` | String | Requis, max 500 | Description complète |
| `eventDate` | Date | Requis, date future | Date de tenue |
| `location` | String | Requis, max 80 | Lieu (ex. Amphi 300) |
| `capacity` | Number | Requis, min 1 | Places totales |
| `bookedCount` | Number | Défaut 0, min 0 | Places déjà réservées |
| `category` | String | Enum | Concert, Conférence, Sport, Atelier, Technologie, Culture, Design |
| `createdAt` | Date | Auto | Horodatage de création |

**Fichier cible :** `server/src/models/Event.js`

### 4.2 Collection `Ticket`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `eventId` | ObjectId | Ref `Event`, requis | Événement associé |
| `studentName` | String | Requis, max 80 | Nom du participant |
| `studentId` | String | Requis | Matricule universitaire |
| `reservationCode` | String | Unique, requis | Code `EVT-XXXXXX` |
| `bookingDate` | Date | Défaut `Date.now` | Date de réservation |

**Index unique :** `reservationCode`

**Fichier cible :** `server/src/models/Ticket.js`

### 4.3 Génération du code de réservation

```
Format   : EVT-XXXXXX
Alphabet : A-Z, 0-9 (6 caractères)
Algorithme : Math.random().toString(36).substring(2, 8).toUpperCase()
Exemples : EVT-8A4F2Z · EVT-K3PQX9 · EVT-7ZBR9M
```

L'unicité est garantie par l'index MongoDB. En cas de collision (probabilité négligeable), régénérer avant insertion.

---

## 5. API REST

**Base URL :** `http://localhost:5000/api` (développement)

### 5.1 Événements

| Méthode | Route | Description | Réponses |
|---------|-------|-------------|----------|
| `POST` | `/events` | Créer un événement | `201` · `400` |
| `GET` | `/events` | Lister les événements à venir | `200` |
| `GET` | `/events/:id` | Détail d'un événement | `200` · `404` |

**Query params pour `GET /events` (P1/P2) :**

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filtrer par catégorie |
| `search` | string | Recherche textuelle (titre, lieu) |
| `page` | number | Numéro de page (défaut 1) |
| `limit` | number | Éléments par page (défaut 6) |

### 5.2 Billets

| Méthode | Route | Description | Réponses |
|---------|-------|-------------|----------|
| `POST` | `/events/:id/tickets` | Réserver une place | `201` · `400` · `404` |
| `GET` | `/events/:id/tickets` | Lister les billets d'un événement | `200` · `404` |

### 5.3 Format de réponse standardisé

**Succès :**

```json
{
  "success": true,
  "data": { }
}
```

**Erreur :**

```json
{
  "success": false,
  "error": {
    "code": "EVENT_FULL",
    "message": "Cet événement est complet."
  }
}
```

### 5.4 Logique de réservation (critique)

Séquence obligatoire pour `POST /events/:id/tickets` :

1. Vérifier l'existence de l'événement (`404` si absent)
2. Contrôler `bookedCount < capacity` (`400 EVENT_FULL` si complet)
3. Valider `studentName` et `studentId`
4. Générer un `reservationCode` unique
5. Créer le document `Ticket`
6. Incrémenter atomiquement `bookedCount` (+1)
7. Retourner le ticket créé (`201`)

> Cette vérification de capacité ne doit jamais être déléguée au front-end. Le bouton désactivé en UI est une mesure d'ergonomie, pas de sécurité.

**Fichiers cibles :**

```
server/src/routes/eventRoutes.js
server/src/routes/ticketRoutes.js
server/src/controllers/eventController.js
server/src/controllers/ticketController.js
server/src/services/ticketService.js
server/src/services/reservationCodeService.js
```

---

## 6. Architecture front-end

### 6.1 Routage

| Route | Composant | Priorité MVP |
|-------|-----------|--------------|
| `/` | `HomePage` | P0 |
| `/events` | `EventCatalog` | P0 |
| `/events/:id` | `EventDetail` | P0 |
| `/create` | `CreateEvent` | P0 |
| `/ticket/:code` | `TicketSuccess` | P0 |
| `/dashboard` | `Dashboard` | P1 |
| `/myticket` | `MyTickets` | P1 |

**Fichier cible :** `client/src/App.jsx` (déclaration des routes via `react-router-dom`)

### 6.2 Composants réutilisables

| Composant | Responsabilité | Fichier cible |
|-----------|----------------|---------------|
| `Navbar` | Navigation principale, logo, liens, recherche | `components/layout/Navbar.jsx` |
| `EventCard` | Carte d'aperçu dans le catalogue | `components/events/EventCard.jsx` |
| `CategoryFilter` | Filtres horizontaux par catégorie | `components/events/CategoryFilter.jsx` |
| `ProgressBar` | Jauge `bookedCount / capacity` | `components/events/ProgressBar.jsx` |
| `BookingModal` | Formulaire nom + matricule | `components/booking/BookingModal.jsx` |

### 6.3 Couche API client

Centraliser tous les appels HTTP dans `client/src/api/` :

```
client/src/api/
├── client.js          # Instance axios (baseURL, intercepteurs)
├── events.js          # getEvents, getEventById, createEvent
└── tickets.js         # bookTicket, getTicketsByEvent
```

**Variable d'environnement front-end :**

```
VITE_API_URL=http://localhost:5000/api
```

Fichier : `client/.env.example`

### 6.4 État et gestion des données

Pour le MVP, **pas de store global** (Redux, Zustand). L'état local React (`useState`, `useEffect`) suffit. Chaque page charge ses données via la couche API et gère loading / error / empty states explicitement.

Patterns attendus sur chaque page :

- **Loading** — skeleton ou spinner pendant l'appel API
- **Error** — message clair avec possibilité de réessayer
- **Empty** — état vide explicite (catalogue sans événements)
- **Double soumission** — désactiver le bouton pendant la requête POST

---

## 7. Design system

Philosophie : **Neutral Premium** — fond clair, typographie dense, accents violets, interactions sobres.

### 7.1 Tokens de couleur

| Token | HEX | Usage |
|-------|-----|-------|
| `--color-bg` | `#F8F8FA` | Fond global |
| `--color-text-primary` | `#0A0A0A` | Titres, éléments critiques |
| `--color-text-secondary` | `#3A3A3C` | Corps de texte |
| `--color-accent` | `#5856D6` | Badges, focus, accents |
| `--color-btn-primary` | `#0A0A0A` | CTA principaux |
| `--color-success` | `#34C759` | Places disponibles (> 30 %) |
| `--color-warning` | `#FF9500` | Places limitées (< 30 %) |
| `--color-danger` | `#FF3B30` | Événement complet |
| `--color-border` | `#D1D1D6` | Séparateurs, champs |
| `--color-card` | `#FFFFFF` | Fond des cartes |

**Fichier cible :** `client/src/styles/tokens.css`

### 7.2 Typographie

Police principale : **Inter** (fallback système : `-apple-system, BlinkMacSystemFont, sans-serif`).

| Élément | Taille | Graisse |
|---------|--------|---------|
| H1 | 40–48 px | 800 |
| H2 | 28–32 px | 700 |
| H3 | 20–22 px | 600 |
| Body | 15–16 px | 400 |
| Caption | 12–13 px | 400 |

### 7.3 Composants UI

| Élément | Spécification |
|---------|---------------|
| Bouton primaire | Fond `#0A0A0A`, texte blanc, `border-radius: 100px`, padding `14px 28px` |
| Bouton secondaire | Transparent, bordure `1.5px #D1D1D6`, hover `#F2F2F7` |
| Bouton désactivé | Fond `#F2F2F7`, texte `#8E8E93`, `cursor: not-allowed` |
| Champ de formulaire | Bordure `1px #D1D1D6`, radius `12px`, focus bordure `#5856D6` |
| EventCard | Fond blanc, radius `16px`, ombre `0 2px 12px rgba(0,0,0,0.07)` |

### 7.4 Responsive

| Breakpoint | Comportement |
|------------|--------------|
| `< 640px` | Grille 1 colonne, navigation condensée, billet empilé |
| `640–1024px` | Grille 2 colonnes |
| `> 1024px` | Grille 3 colonnes, EventDetail en deux colonnes |

Taille minimale de police sur mobile : **14 px**.

---

## 8. Variables d'environnement

### 8.1 Serveur (`server/.env.example`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventbrite
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 8.2 Client (`client/.env.example`)

```env
VITE_API_URL=http://localhost:5000/api
```

> Ne jamais committer les fichiers `.env`. Les fichiers `.env.example` documentent les clés requises sans exposer de secrets.

---

## 9. Intégration client ↔ serveur

### 9.1 CORS

Le serveur autorise l'origine du client Vite (`http://localhost:5173` en développement) via le middleware `cors`.

### 9.2 Proxy Vite (optionnel)

Alternative au CORS strict : proxy de développement dans `vite.config.js` :

```js
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

### 9.3 Contrat d'intégration

Avant toute implémentation front-end d'un écran, le contrat API correspondant doit être validé :

1. Route disponible et testée (Postman / Thunder Client)
2. Format JSON documenté et stable
3. Codes d'erreur métier définis (`EVENT_FULL`, `EVENT_NOT_FOUND`, `VALIDATION_ERROR`)

Le responsable intégration (back-end lead) maintient une collection Postman partagée dans `docs/postman/` (à créer J2).

---

## 10. Exigences non fonctionnelles

| Exigence | Cible | Responsable |
|----------|-------|-------------|
| Temps de chargement initial | < 3 s (3G) | Front-end |
| Temps de réponse API | < 500 ms (GET/POST) | Back-end |
| Pagination catalogue | 6 événements par page | Back-end + Front-end |
| Contraste WCAG | AA (4.5:1) | Front-end |
| Accessibilité clavier | Focus visible, `aria-label` | Front-end |
| Images | WebP, max 150 Ko | Front-end |

---

## 11. Périmètre MVP

### Inclus (P0–P1)

- Catalogue paginé d'événements à venir
- Détail d'événement avec CTA de réservation
- Création d'événement (formulaire guidé)
- Réservation avec génération de code unique
- Billet numérique visuel (TicketSuccess)
- Suivi des inscriptions + barre de progression (Dashboard)
- Filtrage par catégorie

### Exclus

- Paiement en ligne
- Envoi d'e-mails automatiques
- Authentification / comptes utilisateurs
- Notifications push ou SMS
- Analytics avancés
- Application mobile native

---

## 12. Critères de validation technique

| Critère | Pondération | Vérification |
|---------|-------------|--------------|
| Séparation des responsabilités | 15 % | Dossiers `client/` et `server/` distincts, aucune logique métier en React |
| Fonctionnalité API | 20 % | Les 5 routes REST répondent correctement |
| Interface utilisateur | 20 % | Fidélité aux maquettes, design system respecté |
| Logique de capacité | 15 % | Test : réserver au-delà de `capacity` → `400` |
| Billet numérique | 15 % | Code visible, QR code, lisible sur iPhone SE |
| Responsive | 10 % | Mobile, tablette, desktop |
| Qualité du code | 5 % | Structure claire, nommage cohérent |

---

## 13. Références

- Cahier des charges : `docs/Eventix_Cahier_des_Charges.pdf`
- Plan d'équipe et sprint : `docs/plan.md`
- Instructions de démarrage : `README.md`
