# EventBrite

Plateforme web de billetterie événementielle pour les clubs et associations de l'Université de Maroua — ENSPM.

EventBrite permet aux organisateurs de publier des événements, de gérer la capacité en temps réel et de suivre les inscriptions. Les participants découvrent les événements à venir, réservent une place en quelques secondes et reçoivent un billet numérique unique.

Conçue avec la rigueur d'un produit grand public : interface épurée, parcours fluide, logique métier fiable.

---

## Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| Catalogue d'événements | Liste paginée des événements à venir, avec filtres par catégorie |
| Détail d'événement | Informations complètes, jauge de places, réservation instantanée |
| Création d'événement | Formulaire guidé pour les organisateurs de clubs |
| Réservation | Saisie nom et matricule, génération d'un code unique `EVT-XXXXXX` |
| Billet numérique | Affichage visuel post-réservation avec QR code |
| Tableau de bord | Suivi des inscriptions et barre de progression par événement |

---

## Stack technique

| Couche | Technologies |
|--------|--------------|
| Front-end | React 19 · Vite 8 · React Router · Axios |
| Back-end | Node.js · Express 5 · Mongoose 9 |
| Base de données | MongoDB |
| Style | CSS custom · Design system « Neutral Premium » · Inter |

---

## Structure du projet

```
eventbrite-enspm/
├── client/          # Application React (Vite)
├── server/          # API REST Express
├── docs/
│   ├── architecture.md              # Architecture technique complète
│   ├── plan.md                      # Plan d'équipe
│   └── Eventix_Cahier_des_Charges.pdf
└── README.md
```

---

## Prérequis

- **Node.js** ≥ 18 LTS
- **npm** ≥ 9
- **MongoDB** ≥ 6 (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/zzAdji/eventbrite-enspm.git
cd eventbrite-enspm
```

### 2. Configurer le serveur

```bash
cd server
npm install
cp .env.example .env
```

Éditer `server/.env` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventbrite
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Configurer le client

```bash
cd ../client
npm install
cp .env.example .env
```

Éditer `client/.env` :

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Installer les dépendances complémentaires

Consultez la section **Stack technologique** de [`docs/architecture.md`](docs/architecture.md) pour la liste des packages à installer (`react-router-dom`, `axios`, `express-validator`, etc.).

---

## Démarrage

Ouvrir deux terminaux.

**Terminal 1 — API :**

```bash
cd server
npm run dev
```

Le serveur écoute sur `http://localhost:5000`.

**Terminal 2 — Client :**

```bash
cd client
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

---

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/events` | Créer un événement |
| `GET` | `/api/events` | Lister les événements à venir |
| `GET` | `/api/events/:id` | Détail d'un événement |
| `POST` | `/api/events/:id/tickets` | Réserver une place |
| `GET` | `/api/events/:id/tickets` | Lister les billets d'un événement |

Documentation complète des modèles, contrats JSON et logique métier : [`docs/architecture.md`](docs/architecture.md).

---

## Équipe

| Rôle | Périmètre |
|------|-----------|
| Back-end Lead & Intégration | API REST, modèles, coordination front/back |
| Back-end Developer | Validation, middleware, tests API |
| Front-end Lead | Design system, routing, revue UI |
| Front-end Developer 1 | Accueil, catalogue, dashboard |
| Front-end Developer 2 | Détail, réservation, billet numérique |

Plan détaillé jour par jour : [`docs/plan.md`](docs/plan.md).

---

## Documentation

| Document | Contenu |
|----------|---------|
| [`docs/architecture.md`](docs/architecture.md) | Architecture, modèles, API, design system, dépendances |
| [`docs/plan.md`](docs/plan.md) | Répartition des tâches, planning 7 jours, checklist MVP |
| [`docs/Eventix_Cahier_des_Charges.pdf`](docs/Eventix_Cahier_des_Charges.pdf) | Cahier des charges officiel |

---

## Contexte académique

**Projet** — Application Full-Stack EventBrite Local  
**Établissement** — Université de Maroua, ENSPM, Département INFOTEL  
**Superviseur** — M. MANAODA DEUHWE Yves Hermann  
**Année académique** — 2025/2026

---

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier [`LICENSE`](LICENSE) pour les détails.
