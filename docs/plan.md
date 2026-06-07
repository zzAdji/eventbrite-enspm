# EventBrite — Plan d'équipe et de livraison

**Version** 1.0 · **Durée du sprint** 7 jours · **Équipe** 5 développeurs

---

## 1. Composition de l'équipe

| Rôle | Périmètre | Responsabilités clés |
|------|-----------|----------------------|
| **BE-Lead** — Back-end & Intégration | `server/` · contrats API · CI du monorepo | Modèles Mongoose, routes REST, logique de réservation, revue des PR back-end, **pont entre back et front**, collection Postman, résolution des blocages d'intégration |
| **BE-Dev** — Back-end | `server/` | Middleware, validation, gestion d'erreurs, tests API, documentation `.env.example`, support sur les query params (filtres, pagination, recherche) |
| **FE-Lead** — Front-end | `client/` · architecture UI | Routing React, design system (`tokens.css`), composants layout (`Navbar`), revue des PR front-end, cohérence visuelle globale |
| **FE-Dev 1** — Front-end | `client/src/pages/` · catalogue | `HomePage`, `EventCatalog`, `EventCard`, `CategoryFilter`, pagination et filtres côté UI |
| **FE-Dev 2** — Front-end | `client/src/pages/` · parcours participant | `EventDetail`, `BookingModal`, `TicketSuccess`, `MyTickets`, couche API client |

> Remplacez les identifiants **BE-Lead**, **BE-Dev**, **FE-Lead**, **FE-Dev 1**, **FE-Dev 2** par les noms réels de l'équipe dès la kickoff.

---

## 2. Principes de collaboration

### 2.1 Règles de travail

1. **Une branche par tâche** — nommage : `feat/be-event-model`, `feat/fe-event-catalog`, `fix/be-capacity-check`.
2. **Pull request obligatoire** — au moins une relecture avant merge sur `develop`.
3. **BE-Lead valide tout contrat API** avant que le front-end ne consomme une route.
4. **FE-Lead valide toute contribution UI** avant merge (design system, responsive, accessibilité).
5. **Daily standup** — 15 minutes, même horaire chaque jour : hier / aujourd'hui / blocages.
6. **Canal d'intégration** — BE-Lead publie les changements d'API dans un message structuré (route, méthode, body, réponses).

### 2.2 Points de synchronisation

| Moment | Participants | Objectif |
|--------|--------------|----------|
| **Kickoff (J1 matin)** | Toute l'équipe | Lecture du périmètre MVP, assignation des rôles, création des branches |
| **Sync API (J2 fin de journée)** | BE-Lead, BE-Dev, FE-Lead | Démo des 5 routes REST · remise de la collection Postman |
| **Sync Intégration (J4 midi)** | BE-Lead, FE-Lead, FE-Dev 1 | Catalogue branché sur l'API · validation du format JSON |
| **Sync Réservation (J5 fin de journée)** | BE-Lead, FE-Dev 2 | Parcours complet réservation → billet · test de capacité |
| **Revue finale (J7 matin)** | Toute l'équipe | Checklist MVP, corrections, préparation démo |

### 2.3 Où travailler

| Zone | Qui | Quoi |
|------|-----|------|
| `server/src/models/` | BE-Lead | Schémas Event, Ticket |
| `server/src/routes/` · `controllers/` · `services/` | BE-Lead, BE-Dev | API REST |
| `server/src/middleware/` | BE-Dev | Validation, erreurs |
| `client/src/styles/` · `components/layout/` | FE-Lead | Design system, Navbar |
| `client/src/components/events/` | FE-Dev 1 | EventCard, CategoryFilter, ProgressBar |
| `client/src/pages/` (catalogue, accueil) | FE-Dev 1 | HomePage, EventCatalog |
| `client/src/pages/` (détail, billet) | FE-Dev 2 | EventDetail, TicketSuccess, MyTickets |
| `client/src/components/booking/` · `client/src/api/` | FE-Dev 2 | BookingModal, couche HTTP |
| `client/src/pages/CreateEvent.jsx` | FE-Lead (J6) | Formulaire création · intégration POST |
| `client/src/pages/Dashboard.jsx` | FE-Dev 1 (J6) | Suivi inscriptions · GET tickets |
| `docs/` · `README.md` | BE-Lead + FE-Lead (J7) | Documentation finale |

---

## 3. Planning détaillé — 7 jours

### Jour 1 — Setup & Fondations

**Objectif :** Environnement opérationnel, structure de dossiers, modèles de données.

| Qui | Quoi | Où | Livrable fin J1 |
|-----|------|----|-----------------|
| BE-Lead | Init serveur Express, connexion MongoDB, structure `server/src/` | `server/` | Serveur démarre sur `:5000`, health check `GET /api/health` |
| BE-Lead | Schémas Mongoose `Event` et `Ticket` | `server/src/models/` | Modèles avec validations et index unique sur `reservationCode` |
| BE-Dev | `.env.example`, scripts npm `dev`/`start`, middleware async wrapper | `server/` | Documentation des variables, `npm run dev` fonctionnel |
| FE-Lead | Install deps front (`react-router-dom`, `axios`, `@fontsource/inter`) | `client/` | `package.json` à jour, routing de base |
| FE-Lead | Tokens CSS, typographie Inter, reset global | `client/src/styles/` | `tokens.css` + import dans `index.css` |
| FE-Dev 1 | Structure dossiers `pages/`, `components/`, `api/` | `client/src/` | Arborescence créée, pages vides routées |
| FE-Dev 2 | Instance axios, fichier `api/client.js` | `client/src/api/` | Client HTTP configuré avec `VITE_API_URL` |

**Critère de sortie J1 :** `npm run dev` fonctionne côté client et serveur. MongoDB connecté. Routes vides mais structure en place.

---

### Jour 2 — API Back-end complète

**Objectif :** Les 5 routes REST implémentées et testées.

| Qui | Quoi | Où | Livrable fin J2 |
|-----|------|----|-----------------|
| BE-Lead | `POST /api/events`, `GET /api/events`, `GET /api/events/:id` | `server/src/` | CRUD événements opérationnel |
| BE-Lead | Logique de réservation complète + incrément atomique `bookedCount` | `server/src/services/` | `POST /api/events/:id/tickets` avec contrôle capacité |
| BE-Dev | `GET /api/events/:id/tickets`, validation `express-validator` | `server/src/` | Liste billets + messages d'erreur standardisés |
| BE-Dev | Middleware gestion d'erreurs global, codes métier (`EVENT_FULL`, etc.) | `server/src/middleware/` | Réponses JSON uniformes |
| BE-Lead | Collection Postman / Thunder Client exportée | `docs/postman/` | Fichier partagé avec l'équipe front |
| FE-Lead | Composant `Navbar` conforme maquettes | `client/src/components/layout/` | Navigation fonctionnelle sur toutes les routes |
| FE-Dev 1 | Composant `EventCard` (statique, données mockées) | `client/src/components/events/` | Carte visuelle avec indicateur de places |
| FE-Dev 2 | Fonctions `api/events.js` et `api/tickets.js` (prêtes, non branchées) | `client/src/api/` | Signatures alignées sur le contrat J2 |

**Critère de sortie J2 :** Toutes les routes testées manuellement. BE-Lead anime la **Sync API** en fin de journée.

---

### Jour 3 — Composants de base & Routing

**Objectif :** Fondations UI réutilisables, routing complet.

| Qui | Quoi | Où | Livrable fin J3 |
|-----|------|----|-----------------|
| FE-Lead | Routing complet des 7 écrans, layout wrapper | `client/src/App.jsx` | Navigation entre toutes les pages (contenu placeholder OK) |
| FE-Lead | Composants UI atomiques : boutons, champs, badges | `client/src/components/ui/` | Bibliothèque interne cohérente avec le design system |
| FE-Dev 1 | `CategoryFilter`, `ProgressBar` | `client/src/components/events/` | Filtres cliquables + jauge capacité |
| FE-Dev 1 | `HomePage` — hero, catégories, CTA | `client/src/pages/HomePage.jsx` | Page d'accueil fidèle à la maquette |
| FE-Dev 2 | `BookingModal` — formulaire nom + matricule | `client/src/components/booking/` | Modal avec validation locale, états loading/error |
| BE-Dev | Query params : `category`, `search`, `page`, `limit` sur `GET /events` | `server/src/` | Filtrage et pagination côté serveur |
| BE-Lead | Revue PR back-end, support intégration | — | Aucun blocage API ouvert |

**Critère de sortie J3 :** Navigation fluide. Composants réutilisables prêts. API paginée disponible.

---

### Jour 4 — Pages principales & Catalogue live

**Objectif :** Catalogue connecté à l'API, pages d'accueil et détail opérationnelles.

| Qui | Quoi | Où | Livrable fin J4 |
|-----|------|----|-----------------|
| FE-Dev 1 | `EventCatalog` — grille, recherche, filtres, pagination | `client/src/pages/EventCatalog.jsx` | `GET /api/events` branché, 6 events/page |
| FE-Dev 1 | États loading (skeleton), empty, error | `EventCatalog` | UX robuste sur échec réseau |
| FE-Dev 2 | `EventDetail` — breadcrumb, infos, bloc réservation sticky | `client/src/pages/EventDetail.jsx` | `GET /api/events/:id`, bouton désactivé si complet |
| FE-Dev 2 | Intégration `BookingModal` sur EventDetail | `EventDetail` + `BookingModal` | Ouverture modal au clic « Réserver » |
| FE-Lead | Revue responsive EventCard + Catalog (mobile/tablet/desktop) | — | Grille 1/2/3 colonnes validée |
| BE-Lead | Support intégration, corrections contrat si nécessaire | — | **Sync Intégration** à midi |

**Critère de sortie J4 :** Un utilisateur peut parcourir le catalogue et consulter le détail d'un événement avec données réelles.

---

### Jour 5 — Réservation & Billet numérique

**Objectif :** Parcours participant complet, de la réservation au billet.

| Qui | Quoi | Où | Livrable fin J5 |
|-----|------|----|-----------------|
| FE-Dev 2 | Brancher `POST /api/events/:id/tickets` dans BookingModal | `BookingModal` | Réservation fonctionnelle, anti double-soumission |
| FE-Dev 2 | `TicketSuccess` — billet visuel, QR code, code-barres | `client/src/pages/TicketSuccess.jsx` | Redirection `/ticket/:code`, design soigné |
| FE-Dev 2 | `MyTickets` — liste locale ou par matricule (MVP) | `client/src/pages/MyTickets.jsx` | Consultation des billets réservés (session/localStorage) |
| BE-Lead | Tests de charge limite : réserver place 101 sur capacité 100 | — | Retour `400 EVENT_FULL` confirmé |
| BE-Dev | Tests edge cases : event inexistant, champs manquants, code dupliqué | — | Tous les cas documentés dans Postman |
| FE-Lead | Revue TicketSuccess sur iPhone SE (375 px) | — | Billet lisible, QR scannable |

**Critère de sortie J5 :** Parcours complet : catalogue → détail → réservation → billet. **Sync Réservation** en fin de journée.

---

### Jour 6 — Création d'événement & Dashboard

**Objectif :** Parcours organisateur, intégration front/back complète.

| Qui | Quoi | Où | Livrable fin J6 |
|-----|------|----|-----------------|
| FE-Lead | `CreateEvent` — formulaire guidé, aperçu dynamique, compteur 500 car. | `client/src/pages/CreateEvent.jsx` | `POST /api/events`, redirection catalogue |
| FE-Dev 1 | `Dashboard` — liste billets par événement, ProgressBar | `client/src/pages/Dashboard.jsx` | `GET /api/events/:id/tickets` |
| FE-Dev 1 | Validation formulaire création (date future, capacité ≥ 1) | `CreateEvent` | Messages d'erreur inline |
| BE-Dev | Validation serveur miroir (date future, longueurs max) | `server/src/middleware/` | Cohérence front/back sur les règles |
| BE-Lead | Revue intégration globale, correction des régressions | — | Tous les parcours MVP testés |

**Critère de sortie J6 :** Organisateur peut créer un événement et suivre les inscriptions. Participant peut réserver et obtenir un billet.

---

### Jour 7 — Finitions, tests & livraison

**Objectif :** Qualité, responsive, documentation, démo.

| Qui | Quoi | Où | Livrable fin J7 |
|-----|------|----|-----------------|
| FE-Lead | Passe responsive sur tous les écrans | `client/` | Mobile, tablette, desktop validés |
| FE-Dev 1 | Corrections bugs catalogue, pagination, filtres | `client/` | Aucun bug bloquant P0 |
| FE-Dev 2 | Corrections bugs billet, modal, edge cases 404 | `client/` | Page 404 gracieuse |
| BE-Dev | Performance API, logs propres, `.env.example` final | `server/` | Réponses < 500 ms |
| BE-Lead | README final, vérification checklist MVP, script démo | `README.md` | Instructions reproductibles |
| FE-Lead + BE-Lead | **Revue finale** — checklist ci-dessous | — | Go / No-Go démo |

**Critère de sortie J7 :** MVP livrable, démo prête, documentation à jour.

---

## 4. Matrice RACI simplifiée

Légende : **R** = Responsable · **A** = Approbateur · **C** = Consulté · **I** = Informé

| Livrable | BE-Lead | BE-Dev | FE-Lead | FE-Dev 1 | FE-Dev 2 |
|----------|---------|--------|---------|----------|----------|
| Modèles Mongoose | **R/A** | C | I | I | I |
| Routes REST | **R/A** | **R** | C | I | C |
| Logique réservation | **R/A** | C | I | I | C |
| Contrat API / Postman | **R/A** | C | C | I | C |
| Design system | C | I | **R/A** | C | C |
| Navbar · Layout | C | I | **R/A** | I | I |
| HomePage · Catalog | I | I | A | **R** | I |
| EventDetail · Booking | I | I | A | I | **R** |
| TicketSuccess · MyTickets | I | I | A | I | **R** |
| CreateEvent | C | C | **R/A** | C | I |
| Dashboard | I | I | A | **R** | I |
| README · Docs | **R** | C | **R** | I | I |
| Démo finale | **R/A** | C | C | C | C |

---

## 5. Checklist MVP — Go/No-Go (J7)

### Fonctionnel

- [ ] `GET /api/events` retourne les événements à venir, paginés (6/page)
- [ ] `GET /api/events/:id` retourne le détail ou `404`
- [ ] `POST /api/events` crée un événement avec validation
- [ ] `POST /api/events/:id/tickets` réserve et incrémente `bookedCount`
- [ ] Réservation au-delà de la capacité retourne `400`
- [ ] Code de réservation au format `EVT-XXXXXX`, unique
- [ ] Catalogue affiche les EventCards avec places restantes colorées
- [ ] EventDetail désactive le bouton si complet
- [ ] TicketSuccess affiche billet, code, QR code
- [ ] CreateEvent redirige vers le catalogue après création
- [ ] Dashboard affiche les inscriptions avec ProgressBar
- [ ] Filtrage par catégorie fonctionnel

### Qualité

- [ ] Responsive testé (iPhone SE, tablette, desktop)
- [ ] États loading / error / empty sur chaque page API
- [ ] Accessibilité : focus clavier, contrastes, `aria-label`
- [ ] Pas de logique métier critique uniquement côté front
- [ ] `.env.example` présents côté client et serveur
- [ ] README avec instructions d'installation reproductibles

---

## 6. Gestion des risques

| Risque | Impact | Mitigation | Responsable |
|--------|--------|------------|-------------|
| MongoDB non disponible localement | Bloquant J1 | Utiliser MongoDB Atlas (cluster gratuit), URI partagée via `.env.example` | BE-Lead |
| Contrat API instable | Retard front J4 | Gel du contrat après Sync J2 ; versioning des réponses | BE-Lead |
| Divergence visuelle | Note UI basse | FE-Lead valide chaque PR ; tokens CSS centralisés | FE-Lead |
| Collision `reservationCode` | Erreur 500 rare | Retry avec régénération côté serveur | BE-Lead |
| Déséquilibre de charge équipe | Retard J6/J7 | BE-Lead et FE-Lead réallouent les tâches P2 en fin de sprint | BE-Lead + FE-Lead |

---

## 7. Dépendances entre tâches

```
J1 Setup
 ├── J2 API (bloque J4 catalogue, J5 réservation, J6 create/dashboard)
 │    └── J3 Composants base (parallèle avec J2)
 │         └── J4 Catalogue live
 │              └── J5 Réservation + Billet
 │                   └── J6 CreateEvent + Dashboard
 │                        └── J7 Finitions
```

**Règle :** Aucune page front-end ne consomme une route API non validée par BE-Lead.

---

## 8. Communication

| Canal | Usage |
|-------|-------|
| Standup quotidien | Avancement, blocages, réajustements |
| PR GitHub | Revue de code, traçabilité |
| Message structuré (BE-Lead) | Annonce de changement de contrat API |
| `docs/plan.md` | Ce document — mis à jour si réallocation |
| `docs/architecture.md` | Référence technique — mise à jour si décision architecturale |

---

## 9. Prochaines actions immédiates

1. **Attribuer les noms** aux rôles BE-Lead, BE-Dev, FE-Lead, FE-Dev 1, FE-Dev 2.
2. **Créer la branche `develop`** et protéger `main`.
3. **Provisionner MongoDB** (local ou Atlas) et partager l'URI via un canal sécurisé (pas dans Git).
4. **Kickoff J1** — valider ce plan, lancer le setup parallèle back/front.
5. **Installer les dépendances manquantes** listées dans `docs/architecture.md` §3.
