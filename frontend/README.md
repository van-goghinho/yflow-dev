# Y'Flow

Plateforme web qui rend la puissance de **n8n** et **Mistral AI** accessible via une galerie de workflows pré-paramétrés. Monorepo TypeScript (NestJS + React + Prisma + PostgreSQL).

- **Démo prod** : <http://217.182.204.220:3000>
- **Repo** : <https://github.com/van-goghinho/yflow-dev>

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite 7 + React Router 7 + ReactFlow 11 |
| Backend | NestJS 11 + Prisma 6 + PostgreSQL 18 |
| Auth | JWT (`@nestjs/jwt`) + bcrypt + Passport |
| Orchestration | n8n Community (REST API + webhooks) |
| IA | Mistral AI (via n8n) |
| Infra | Docker + Nginx Proxy Manager + Watchtower (auto-deploy) |
| CI/CD | GitHub Actions → GHCR |

Détails et trade-offs : [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md).

## Pré-requis

- Node.js v20+
- npm v10+
- Docker (pour la DB locale)
- Une instance n8n joignable (locale ou prod) avec une clé API et les webhooks `resume-ia` + `email-generator` actifs (pour tester l'exécution de workflows)

## Démarrage local

```bash
# 1. Base de données (Postgres 16-alpine)
cd frontend
docker compose up -d                    # port 5432

# 2. Backend (NestJS, port 3001)
cd apps/backend
cp .env.example .env                    # voir "Variables d'environnement" ci-dessous
npm install
npx prisma migrate deploy
npx prisma db seed                      # charge 2 workflows démo
npm run start:dev

# 3. Frontend (Vite, port 5173)
cd ../frontend
npm install
npm run dev
```

> Le frontend seul (`npm run dev` depuis `apps/frontend`) est consultable mais la galerie sera vide tant que le backend n'est pas démarré.

## Variables d'environnement

**Backend** (`apps/backend/.env`) :

```
DATABASE_URL=postgresql://postgres:yflow_dev_password@localhost:5432/yflow_dev
JWT_SECRET=<secret long, généré aléatoirement>
N8N_API_URL=http://localhost:5678
N8N_API_KEY=<généré dans n8n Settings > API>
PORT=3001
```

**Frontend** (`apps/frontend/.env.development`) :

```
VITE_API_URL=http://localhost:3001/api
```

## Structure du repo

```
yflow-dev/
├── docs/
│   └── ARCHITECTURE.md         # justification des choix tech
├── frontend/                   # monorepo npm workspaces
│   ├── apps/
│   │   ├── frontend/           # React + Vite (port 5173 dev, 3000 prod)
│   │   └── backend/            # NestJS + Prisma (port 3001)
│   ├── packages/shared/        # types partagés (à étoffer)
│   └── docker-compose.yml      # Postgres dev local
├── .github/workflows/          # CI/CD frontend + backend
├── CLAUDE.md                   # contexte agentique
├── PROJECT_AUDIT.md            # audit technique complet
└── REMAINING_WORK.md           # plan de complétion technique
```

## API Backend

Préfixe : `/api`.

### Auth (non protégées)
```
POST /api/auth/register   { email, password, name } → { message, userId }
POST /api/auth/login      { email, password } → { access_token, user }
```

### Users (JWT requis)
```
GET  /api/users/me
PUT  /api/users/me            { name?, email? }
PUT  /api/users/me/password   { currentPassword, newPassword }
```

### Workflows
```
GET    /api/workflows/public          → liste des workflows publics (galerie)
GET    /api/workflows                 → liste des workflows de l'utilisateur  (JWT)
GET    /api/workflows/:id             → détail                                (JWT)
POST   /api/workflows                 → créer                                 (JWT)
PUT    /api/workflows/:id             → modifier                              (JWT)
DELETE /api/workflows/:id             → supprimer                             (JWT)
POST   /api/workflows/:id/run         → exécuter via n8n                      (JWT)
```

## Conventions

Voir aussi `CLAUDE.md` pour les conventions de code.

- Commits : `type: description en français` (`feat`, `fix`, `refactor`, `style`, `docs`, `test`, `ci`, `chore`).
- Backend : routes protégées avec `@UseGuards(JwtAuthGuard)`, `userId` extrait du JWT (`req.user.sub`), bcrypt 10 rounds.
- Frontend : appels API via `services/api.ts` uniquement (jamais de `fetch` direct), navigation via `<Link>` (jamais `<a href>` interne).
- Prisma 6 — pas d'upgrade vers 7 (breaking changes).
- Node 18 dans les Dockerfiles.

## Documentation technique

- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — choix techniques & trade-offs
- [`../PROJECT_AUDIT.md`](../PROJECT_AUDIT.md) — audit technique complet (sécurité, dette, tests)
- [`../REMAINING_WORK.md`](../REMAINING_WORK.md) — plan de complétion (ce qui reste à faire)
- [`../CLAUDE.md`](../CLAUDE.md) — contexte projet pour agents
