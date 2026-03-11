# Yflow — Sprint Plan & Specs Techniques
## Code Freeze : 1er avril 2026 | 3 semaines restantes

---

## Architecture actuelle

```
yflow-dev/
├── .github/workflows/deploy-frontend.yml   # CI/CD (build + push image Docker)
├── .agent/rules/persona.md
├── frontend/
│   ├── apps/
│   │   ├── frontend/          # React + Vite + ReactFlow (port 3000 en prod)
│   │   │   ├── src/
│   │   │   │   ├── components/  # Navbar, Footer, LoginForm, SignupForm, etc.
│   │   │   │   ├── pages/       # LandingPage, AuthPage, DashboardPage, etc.
│   │   │   │   ├── context/     # AuthContext, ToastContext
│   │   │   │   ├── layouts/     # DashboardLayout
│   │   │   │   └── App.tsx      # Routes principales
│   │   │   ├── Dockerfile       # Multi-stage: Node build → Nginx
│   │   │   └── nginx.conf
│   │   └── backend/             # NestJS + Prisma + PostgreSQL
│   │       ├── src/
│   │       │   ├── auth/        # JWT auth (signIn, signUp)
│   │       │   ├── users/       # CRUD users
│   │       │   ├── prisma/      # Prisma service
│   │       │   └── main.ts      # Port 3000, CORS localhost
│   │       └── prisma/schema.prisma  # Models: User, Workflow
│   ├── packages/shared/
│   ├── docker-compose.yml       # Postgres dev local
│   └── package.json             # Monorepo workspaces
```

## Infra VPS (217.182.204.220)

| Service         | Port  | Réseau Docker | Image                                          |
|-----------------|-------|---------------|-------------------------------------------------|
| Frontend        | 3000  | npm_default   | ghcr.io/van-goghinho/yflow-dev/frontend:latest  |
| n8n             | 5678  | n8n_default + npm_default | docker.n8n.io/n8nio/n8n             |
| n8n-postgresql  | 5432  | n8n_default   | postgres:17                                     |
| NPM (proxy)     | 80/443| npm_default   | jc21/nginx-proxy-manager:latest                 |
| NPM Admin       | 81    | npm_default   | jc21/nginx-proxy-manager:latest                 |
| npm-db-1        | 5432  | npm_default   | postgres:17                                     |
| Portainer       | 9443  | bridge        | portainer                                       |
| Watchtower      | -     | -             | containrrr/watchtower (auto-deploy frontend)    |

**CI/CD** : Push main → GitHub Actions build image → GHCR → Watchtower pull & redeploy (5 min)

**n8n API** : accessible depuis les conteneurs sur npm_default via `http://n8n:5678`

---

## SEMAINE 1 (11-18 mars) — Backend : Module Workflow + n8n Wrapper

### Tâche 1.1 : Module Workflow CRUD

**Fichiers à créer :**
- `frontend/apps/backend/src/workflows/workflows.module.ts`
- `frontend/apps/backend/src/workflows/workflows.controller.ts`
- `frontend/apps/backend/src/workflows/workflows.service.ts`
- `frontend/apps/backend/src/workflows/dto/create-workflow.dto.ts`
- `frontend/apps/backend/src/workflows/dto/update-workflow.dto.ts`

**Spécifications :**

Le controller expose les endpoints suivants (préfixe `/api/workflows`) :

```
GET    /api/workflows          → Liste les workflows de l'utilisateur connecté
GET    /api/workflows/:id      → Détail d'un workflow
POST   /api/workflows          → Créer un workflow (sauvegarde en DB via Prisma)
PUT    /api/workflows/:id      → Modifier un workflow
DELETE /api/workflows/:id      → Supprimer un workflow
POST   /api/workflows/:id/run  → Déclencher l'exécution via n8n
```

Le service utilise Prisma pour le CRUD et appelle l'API n8n pour l'exécution.

**Tous les endpoints sauf GET /api/workflows (galerie publique) nécessitent un JWT valide.**

Le modèle Prisma `Workflow` existe déjà :
```prisma
model Workflow {
  id         String   @id @default(uuid())
  name       String
  userId     String
  definition Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Tâche 1.2 : Service n8n Wrapper

**Fichiers à créer :**
- `frontend/apps/backend/src/n8n/n8n.module.ts`
- `frontend/apps/backend/src/n8n/n8n.service.ts`
- `frontend/apps/backend/src/n8n/n8n.config.ts`

**Spécifications :**

Le service n8n encapsule les appels à l'API REST de n8n :
- `GET /api/v1/workflows` → Lister les workflows n8n
- `POST /api/v1/workflows` → Créer un workflow dans n8n
- `POST /api/v1/workflows/:id/activate` → Activer un workflow
- `POST /api/v1/workflows/:id/deactivate` → Désactiver
- `POST /webhook/<webhook-id>` → Déclencher un workflow via webhook

**Configuration (variables d'environnement à ajouter au .env) :**
```
N8N_API_URL=http://n8n:5678        # URL interne Docker (en prod)
N8N_API_KEY=<clé API n8n>          # Générer dans n8n > Settings > API
```

**En local (dev)** : `N8N_API_URL=http://localhost:5678`

**Le n8n.service.ts utilise fetch/axios pour appeler l'API n8n avec le header `X-N8N-API-KEY`.**

### Tâche 1.3 : Sécuriser l'auth

**Fichier à modifier :**
- `frontend/apps/backend/src/auth/auth.service.ts`

**Actions :**
- Installer bcrypt : `npm install bcrypt @types/bcrypt`
- Hasher les mots de passe au signUp avec `bcrypt.hash(password, 10)`
- Comparer au signIn avec `bcrypt.compare(password, hash)`
- Créer un AuthGuard JWT pour protéger les routes

**Fichiers à créer :**
- `frontend/apps/backend/src/auth/jwt.strategy.ts`
- `frontend/apps/backend/src/auth/jwt-auth.guard.ts`

### Tâche 1.4 : Dockeriser le backend

**Fichier à créer :**
- `frontend/apps/backend/Dockerfile`

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /monorepo
COPY package*.json ./
COPY tsconfig.base.json* ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN npm ci
WORKDIR /monorepo/apps/backend
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /monorepo/apps/backend/dist ./dist
COPY --from=builder /monorepo/apps/backend/node_modules ./node_modules
COPY --from=builder /monorepo/apps/backend/prisma ./prisma
COPY --from=builder /monorepo/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

**Modifier `main.ts`** : changer le port par défaut à 3001 (le frontend utilise 3000 en prod).

**Ajouter au workflow CI/CD** `.github/workflows/deploy-backend.yml` (même structure que le frontend, image `ghcr.io/van-goghinho/yflow-dev/backend:latest`, port 3001).

### Tâche 1.5 : Mettre à jour le prefix des routes backend

**Fichier à modifier :**
- `frontend/apps/backend/src/main.ts`

Ajouter `app.setGlobalPrefix('api');` pour que toutes les routes soient préfixées par `/api`.

Mettre à jour le CORS pour autoriser l'URL de production :
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://217.182.204.220:3000',  // Frontend prod
  ],
  credentials: true,
});
```

### Critères de validation Semaine 1 :
- [ ] `POST /api/auth/signup` crée un user avec mot de passe hashé
- [ ] `POST /api/auth/signin` retourne un JWT
- [ ] `GET /api/workflows` retourne la liste des workflows (auth requise)
- [ ] `POST /api/workflows` crée un workflow en DB
- [ ] `POST /api/workflows/:id/run` appelle n8n et retourne le résultat
- [ ] Backend dockerisé et déployable via CI/CD
- [ ] Clé API n8n générée et configurée

---

## SEMAINE 2 (18-25 mars) — Frontend : Galerie, Config, Intégration

### Tâche 2.1 : Service API Frontend

**Fichier à créer :**
- `frontend/apps/frontend/src/services/api.ts`

**Spécifications :**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Wrapper fetch avec auth JWT
async function fetchApi(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Auth
  signIn: (email: string, password: string) =>
    fetchApi('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signUp: (email: string, password: string, name: string) =>
    fetchApi('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),

  // Workflows
  getWorkflows: () => fetchApi('/workflows'),
  getWorkflow: (id: string) => fetchApi(`/workflows/${id}`),
  createWorkflow: (data: any) =>
    fetchApi('/workflows', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkflow: (id: string, data: any) =>
    fetchApi(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkflow: (id: string) =>
    fetchApi(`/workflows/${id}`, { method: 'DELETE' }),
  runWorkflow: (id: string, inputs?: any) =>
    fetchApi(`/workflows/${id}/run`, { method: 'POST', body: JSON.stringify(inputs || {}) }),
};
```

### Tâche 2.2 : Page Galerie (GalleryPage)

**Fichiers à créer :**
- `frontend/apps/frontend/src/pages/GalleryPage.tsx`
- `frontend/apps/frontend/src/components/gallery/WorkflowCard.tsx`
- `frontend/apps/frontend/src/components/gallery/WorkflowGrid.tsx`

**Spécifications :**

La galerie affiche les workflows disponibles sous forme de cartes.
Chaque carte montre : nom, description courte, catégorie (tag), bouton "Utiliser".
Cliquer sur "Utiliser" redirige vers le WorkflowEditorPage avec le workflow chargé.

**Design :** Grille responsive (3 colonnes desktop, 2 tablette, 1 mobile).
Style cohérent avec le DashboardPage existant (fond sombre, cartes avec `rgba(255,255,255,0.03)`, bordures subtiles).

**Route à ajouter dans App.tsx :**
```tsx
<Route path="gallery" element={<GalleryPage />} />
```
(à l'intérieur du groupe `/app`)

### Tâche 2.3 : Intégrer AuthContext avec le vrai backend

**Fichier à modifier :**
- `frontend/apps/frontend/src/context/AuthContext.tsx`

Remplacer le mock auth par les vrais appels API via `api.signIn()` et `api.signUp()`.
Stocker le JWT dans localStorage.
Ajouter un état `loading` pendant la vérification du token au démarrage.

### Tâche 2.4 : Dashboard dynamique

**Fichier à modifier :**
- `frontend/apps/frontend/src/pages/DashboardPage.tsx`

Remplacer les données mock par les vrais appels API :
- Compter les workflows de l'utilisateur
- Afficher les stats réelles (nombre d'exécutions récentes si disponible via n8n)

### Tâche 2.5 : Navigation — ajouter Galerie au menu

**Fichier à modifier :**
- `frontend/apps/frontend/src/layouts/DashboardLayout.tsx`

Ajouter un lien "Galerie" dans la sidebar/navigation du dashboard.

### Tâche 2.6 : Variables d'environnement frontend

**Fichier à créer :**
- `frontend/apps/frontend/.env.production`

```
VITE_API_URL=http://217.182.204.220:3001/api
```

**Fichier à créer :**
- `frontend/apps/frontend/.env.development`

```
VITE_API_URL=http://localhost:3001/api
```

### Critères de validation Semaine 2 :
- [ ] Login/Signup fonctionnels de bout en bout (frontend → backend → DB)
- [ ] Page Galerie affiche les workflows depuis l'API
- [ ] Clic sur "Utiliser" ouvre le workflow dans l'éditeur
- [ ] Dashboard affiche les vraies stats de l'utilisateur
- [ ] Navigation Galerie accessible depuis le menu

---

## SEMAINE 3 (25 mars - 1er avril) — Polish, Sécurité, Déploiement

### Tâche 3.1 : Mentions légales & CGU

**Fichier à modifier :**
- `frontend/apps/frontend/src/pages/LegalPage.tsx`

Injecter le vrai contenu des mentions légales et CGU.
Les routes `/legal` et `/cgu` existent déjà dans App.tsx.

**Contenu requis :**
- Mentions légales : éditeur (projet Ynov), hébergeur (OVHcloud), contact
- CGU : conditions d'utilisation du service, responsabilité, données personnelles
- Politique de confidentialité (RGPD)

### Tâche 3.2 : Nom de domaine + HTTPS

- Acheter un nom de domaine
- Configurer le DNS (A record vers 217.182.204.220)
- Configurer NPM avec proxy hosts + certificats Let's Encrypt :
  - `app.yflow.fr` → yflow-frontend:80
  - `api.yflow.fr` → backend:3001
  - `n8n.yflow.fr` → n8n:5678

### Tâche 3.3 : Pentest (Mayssa)

Périmètre suggéré :
- Injection SQL via les endpoints API
- XSS via les formulaires frontend
- Auth bypass (JWT manipulation)
- CORS misconfiguration
- Exposition de services (ports ouverts)

### Tâche 3.4 : Tests E2E

**Outil suggéré :** Playwright ou Cypress
- Test du parcours inscription → login → créer workflow → exécuter → résultat
- Test de la galerie : affichage, filtrage, utilisation
- Test 404 / routes protégées

### Tâche 3.5 : Code Freeze (1er avril)

- Freeze de la branche main
- Tag de release v1.0.0
- Documentation finale

---

## Notes techniques importantes

### API n8n — Générer une clé API
1. Accéder à n8n : `http://217.182.204.220:5678`
2. Settings → API → Generate API Key
3. Ajouter au .env du backend : `N8N_API_KEY=<clé>`

### Docker — Réseau pour le backend en prod
Le conteneur backend doit être sur `npm_default` ET `n8n_default` pour joindre à la fois le frontend (via NPM) et n8n :
```bash
docker network connect n8n_default yflow-backend
docker network connect npm_default yflow-backend
```

### Sécurité — À ne pas oublier
- Changer le mot de passe PostgreSQL n8n (exposé pendant le debug)
- Changer le JWT_SECRET en production
- Hasher les mots de passe (bcrypt)
- Valider les inputs (class-validator sur NestJS)
- Rate limiting sur les endpoints auth