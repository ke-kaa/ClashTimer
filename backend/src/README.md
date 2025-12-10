# ClashTimer Backend

A Node.js + Express + MongoDB backend for tracking Clash of Clans upgrade progress (accounts, buildings, troops, spells, heroes, pets, siege machines, research, upgrades).

---

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Domains](#data-domains)
- [API Routing](#api-routing)
- [Common Upgrade Flow](#common-upgrade-flow)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Adding a New Domain](#adding-a-new-domain)
- [Contributing](#contributing)

---

## Overview
ClashTimer is a RESTful API that manages player progress and upgrade timing across multiple entity types. It uses a layered architecture:
Routes → Controllers → Services → Models → Utils.

---

## Tech Stack
| Layer    | Technology |
|----------|------------|
| Runtime  | Node.js |
| Framework | Express |
| Database | MongoDB (Mongoose ODM) |
| Pattern  | Modular service/controller architecture |
| Config   | `.env` environment variables |

---

## Project Structure
```
backend/
├── app.js                 # Express app setup
├── server.js              # Server bootstrap
├── package.json
└── src/
    ├── controllers/       # Thin HTTP handlers
    ├── services/          # Business logic
    ├── models/            # Mongoose schemas
    ├── routes/            # Express routers
    ├── utils/             # Helpers (config, timing, validation)
    ├── middlewares/       # (Custom middleware)
    ├── config/            # Config helpers
    └── README.md
```

---

## Data Domains
| Domain    | Purpose |
|-----------|---------|
| Account   | Player profile (TH level, tag, prefs, stats) |
| Building  | Village structures + levels + upgrade state |
| Troop     | Laboratory troops (levels + upgrade timers) |
| Spell     | Spell unlocks and upgrades |
| Hero      | Heroes with timed upgrades |
| Pet       | Pets (unlock, assign to heroes, upgrade) |
| Siege     | Siege machines and upgrades |
| Research  | (Optional) Research queue tracking |
| Upgrade   | Generic upgrade records (if leveraged) |

---

## API Routing
All endpoints are mounted under `/api` (see `routes/index.js`).

| Area        | Base Path            | Examples / Notes |
|-------------|----------------------|------------------|
| Accounts    | `/api/accounts`      | `GET /api/accounts` |
| Search      | `/api/accounts/search` | `GET /api/accounts/search?q=term` |
| Player Tag  | `/api/accounts/playerTag/:playerTag` | Lookup by player tag |
| Stats       | `/api/accounts/:id/stats` | Aggregated entity stats |
| Preferences | `PATCH /api/accounts/:id/preferences` | Update preferences |
| Clan        | `/api/accounts/clan/by/:clanTag/list` | Accounts by clan |
| Buildings   | `/api/buildings`     | `GET /api/buildings/:id` |
| Troops      | `/api/troops`        | CRUD + `/upgrade/*` |
| Spells      | `/api/spells`        | CRUD + `/upgrade/*` |
| Heroes      | `/api/heroes`        | Upgrade + status |
| Pets        | `/api/pets`          | Unlock, assign, upgrade |
| Sieges      | `/api/sieges`        | Unlock, upgrade status |

### Common Upgrade Endpoints
```
POST /:entity/:id/upgrade/start
POST /:entity/:id/upgrade/finish
POST /:entity/:id/upgrade/cancel   (if supported)
GET  /:entity/:id/upgrade/status
```
Many list endpoints accept `?accountId=`.

---

## Common Upgrade Flow
1. Start: Validate (not maxed, not already upgrading) → set `status=Upgrading`, store `upgradeStartTime`, `upgradeEndTime`.
2. Status: Derive `remainingSeconds`, `progressPct` using time + compute utilities.
3. Finish: Ensure end reached → increment level → reset timing fields → `status=Idle`.

---

## Setup
### 1. Install Dependencies
```bash
npm install
```

### 2. Environment File
Create `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/clashtimer
NODE_ENV=development
```

### 3. Run
```bash
# Dev (if nodemon configured)
npm run dev

# Prod / standard
npm start
```

Base URL: `http://localhost:4000/api`

---

## Environment Variables
| Variable     | Description |
|--------------|-------------|
| PORT         | Server port |
| MONGODB_URI  | MongoDB connection string |
| NODE_ENV     | `development` or `production` |

---

## Adding a New Domain
1. Create model in `models/`.
2. Add service functions (CRUD + upgrade logic).
3. Add controller wrappers.
4. Add route file; mount in `routes/index.js`.
5. Extend `itemsByTownHall.js` if availability / max levels needed.
6. (Optional) Add tests.

---

## Error Handling
Services throw either:
- `Error` with `err.status = <code>`
- Plain object `{ status, message }`

Controllers map to JSON:
```json
{ "error": "Meaningful message" }
```
Common codes: 400 (validation) · 404 (not found) · 409 (conflict) · 500 (unhandled).

---

## Utilities Overview
| File                       | Purpose |
|----------------------------|---------|
| itemsByTownHall.js         | Static config (unlock + max levels) |
| validationUtils.js         | ID / input validation helpers |
| upgradeUtils.js            | Upgrade timing helpers |
| computeUpgradeStatusUtils.js | Progress computation |
| timeUtils.js               | Time conversions |
| convertUtils.js            | Misc conversions |

---
