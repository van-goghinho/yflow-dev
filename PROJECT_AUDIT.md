# 📋 Project Audit — `yflow-dev`
> Generated: 2026-05-11 | Model: Claude Opus 4.7 | Scope: full codebase

## 1. 🗂️ Project Overview

**Y'Flow** est une plateforme web d'automatisation intelligente, projet académique B3 Informatique Ynov Aix-en-Provence (2025-2026). Elle propose une galerie de workflows IA prêts à l'emploi (Résumé IA, Générateur d'email…), configurables via formulaires dynamiques, exécutés par n8n + Mistral et restitués en temps réel à l'utilisateur.

- **Statut** : Parcours alpha fonctionnel (galerie → formulaire → exécution n8n → résultat). Code freeze annoncé le 1er avril 2026 ; à ce jour (2026-05-11) le freeze est passé mais des items "à faire" subsistent.
- **Production** : VPS OVH `217.182.204.220` — frontend (3000), backend (3001), n8n (5678), PostgreSQL partagé, Nginx Proxy Manager, Watchtower auto-deploy.
- **CI/CD** : Push `main` → GitHub Actions → GHCR → Watchtower (5 min).

## 2. 🏗️ Architecture & Stack

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite 7 + React Router 7 + ReactFlow 11 + lucide-react |
| Backend | NestJS 11 + Prisma 6 + PostgreSQL 18, JWT (`@nestjs/jwt`) + Passport-JWT + bcrypt 6, axios via `@nestjs/axios` |
| IA / Orchestration | n8n Community (REST API + webhooks) → Mistral AI |
| Infra | Docker (Node 18-alpine builders, Nginx Alpine runtime), Nginx Proxy Manager, Watchtower, GitHub Actions → GHCR |
| Monorepo | npm workspaces (`apps/frontend`, `apps/backend`, `packages/shared`) |

**Flux principal** : Frontend (Vite/Nginx) ↔ Backend NestJS `/api` ↔ PostgreSQL (via Prisma) ↔ n8n REST/webhook ↔ Mistral AI. Auth = JWT Bearer (2h), token persisté en `localStorage` (option "rester connecté") ou `sessionStorage`.

## 3. 📁 Repository Structure (annotated tree, 2-3 levels)

```
yflow-dev/
├── .github/workflows/
│   ├── deploy-frontend.yml         # build+push image GHCR sur push paths frontend
│   └── deploy-backend.yml          # build+push image GHCR sur push paths backend
├── .agent/rules/persona.md         # sprint plan & specs techniques (1er avril)
├── .gitignore                      # minimal (node_modules, .DS_Store, .env)
└── frontend/                       # monorepo root (workspaces)
    ├── package.json                # devDeps TS/eslint/prettier — pas de scripts utiles
    ├── docker-compose.yml          # Postgres 16-alpine dev local (port 5432)
    ├── tsconfig.base.json
    ├── apps/
    │   ├── frontend/               # React + Vite
    │   │   ├── Dockerfile          # multi-stage Node18 → Nginx
    │   │   ├── nginx.conf          # SPA fallback + cache statique
    │   │   ├── .env.production     # VITE_API_URL prod (hardcodée IP)
    │   │   ├── vite.config.ts      # config quasi-vide (plugin react seul)
    │   │   └── src/
    │   │       ├── App.tsx         # Routes principales
    │   │       ├── main.tsx        # bootstrap React StrictMode (console.log debug)
    │   │       ├── pages/          # Landing, Auth, Dashboard, Gallery, WorkflowRun,
    │   │       │                   #   WorkflowEditor, Settings, Legal, Contact, 404
    │   │       ├── components/     # Navbar, Footer, RouteGuards, forms, ui/, gallery/,
    │   │       │                   #   landing/, settings/, dashboard/, workflow/
    │   │       ├── layouts/        # DashboardLayout
    │   │       ├── context/        # AuthContext, ToastContext
    │   │       ├── services/api.ts # Wrapper fetch + JWT auto + ApiError
    │   │       ├── hooks/          # useMediaQuery
    │   │       └── styles/         # Auth.css (+ index.css, App.css)
    │   └── backend/                # NestJS API
    │       ├── Dockerfile          # standalone build (pas de monorepo deps)
    │       ├── nest-cli.json
    │       ├── prisma/
    │       │   ├── schema.prisma   # User, Workflow (description, category, webhookPath, isPublic)
    │       │   ├── seed.ts         # 2 workflows publics : Résumé IA + Email Generator
    │       │   └── migrations/
    │       │       └── 20260108100742_init/migration.sql  # ⚠ schéma initial seul
    │       ├── src/
    │       │   ├── main.ts         # CORS hardcodé, prefix /api, port 3001
    │       │   ├── app.module.ts   # ConfigModule global + tous les modules métier
    │       │   ├── app.controller* # endpoint racine "Hello World!" + spec
    │       │   ├── auth/           # JWT strategy, guard, service, controller
    │       │   ├── users/          # me / update-profile / update-password + DTOs
    │       │   ├── workflows/      # CRUD + /public + /:id/run
    │       │   ├── n8n/            # service axios + config + module
    │       │   └── prisma/         # PrismaService + module global
    │       └── test/app.e2e-spec.ts  # spec stub "Hello World!"
    └── packages/
        └── shared/src/index.ts     # ⚠ vide (`export {}`)
```

## 4. ✅ What Has Been Accomplished (numbered, specific)

1. **Monorepo opérationnel** (npm workspaces) avec frontend/backend/packages — `frontend/package.json:4-7`.
2. **Schéma Prisma** complet pour la galerie : `User` + `Workflow` (avec `description`, `category`, `webhookPath`, `isPublic`) — `prisma/schema.prisma:16-37`.
3. **Seed** créant un utilisateur "system" et deux workflows publics démo (`wf-resume-ia`, `wf-email-generator`) avec définitions d'inputs typées — `prisma/seed.ts:1-77`.
4. **Auth JWT + bcrypt** complète : `signUp` valide email/mot de passe/nom et hash bcrypt 10 rounds ; `signIn` retourne `access_token` + `user` (2h) — `auth/auth.service.ts:13-57`.
5. **Stratégie JWT Passport** + `JwtAuthGuard` injectable — `auth/jwt.strategy.ts:1-18`, `auth/jwt-auth.guard.ts:1-5`.
6. **Users CRUD** (me / update profile / update password avec re-hash bcrypt) — `users/users.controller.ts:1-32`, `users/users.service.ts:34-53`.
7. **Workflows controller** : routes `GET /public` (avant `:id`), `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `POST /:id/run` — `workflows/workflows.controller.ts:1-54`.
8. **WorkflowsService.run** : récupération workflow → appel `executeWebhook(webhookPath, inputs)` → dépaquetage `Array.isArray(n8nResponse) ? n8nResponse[0]?.result : n8nResponse?.result` — `workflows/workflows.service.ts:73-87`.
9. **N8nService** axios + header `X-N8N-API-KEY` : `listWorkflows`, `getWorkflow`, `createWorkflow`, `activate/deactivate`, `executeWebhook` — `n8n/n8n.service.ts:27-97`.
10. **PrismaService** avec lifecycle hooks `onModuleInit/Destroy` + module `@Global()` — `prisma/prisma.service.ts:1-13`, `prisma/prisma.module.ts:1-9`.
11. **Frontend services/api.ts** : wrapper fetch, `ApiError(status, message)`, gestion erreur réseau (`status:0`), endpoints alignés avec backend — `services/api.ts:1-58`.
12. **AuthContext** : restore depuis `localStorage` ou `sessionStorage`, vérification expiration `exp`, choix de stockage selon `rememberMe`, logout via `window.location.href` (pour clear contexte React) — `context/AuthContext.tsx:33-91`.
13. **Routes & guards** : `ProtectedRoute`, `PublicRoute` (redirection si déjà connecté) — `components/RouteGuards.tsx:9-41`, `App.tsx:18-54`.
14. **Galerie publique** (`/app/gallery`) + carte avec catégories (IA/Communication/Productivité), bouton "Utiliser" pointant vers `/app/workflows/:id/run` — `components/gallery/WorkflowCard.tsx:80-91`.
15. **WorkflowRunPage** : formulaire dynamique (text/textarea/select), états loading/error/result, `WorkflowResult` avec spinner, copie clipboard et bouton "Relancer" — `pages/WorkflowRunPage.tsx`, `components/workflow/WorkflowResult.tsx`.
16. **Settings** : `ProfileSettings` (update name/email) + `SecuritySettings` (changement de mot de passe avec confirmation) — `components/settings/*.tsx`.
17. **Toasts** : provider global + auto-dismiss 5 s — `context/ToastContext.tsx`, `components/ui/Toast.tsx`.
18. **Pages légales** : Mentions légales, CGU (8 articles), Politique de confidentialité avec nav inter-section — `pages/LegalPage.tsx:1-194`.
19. **CI/CD** : deux workflows GitHub Actions (frontend/backend) avec build/push GHCR, déclenchement par `paths` + `workflow_dispatch`, tags `latest` + `branch-sha` — `.github/workflows/*.yml`.
20. **DashboardLayout** responsive (sidebar mobile/desktop, overlay, hamburger) — `layouts/DashboardLayout.tsx`.

## 5. 🚧 What Remains To Do

### [CRITICAL] Sécurité — workflows leak entre utilisateurs
Le `WorkflowsController` n'effectue **aucun contrôle d'ownership** : `findOne`, `update`, `remove`, `run` ne vérifient pas `req.user.sub`. Un utilisateur authentifié peut lire/modifier/supprimer/exécuter le workflow d'un autre utilisateur en devinant l'UUID.
- `workflows/workflows.controller.ts:32-53` (handlers passent l'id brut)
- `workflows/workflows.service.ts:45-87` (aucun `where: { userId }` côté `findOne/update/remove`)
**Action** : injecter `req.user.sub` dans chaque méthode de service et filtrer (`findFirst({ where: { id, userId } })`), excepté pour les workflows `isPublic` (run autorisé sans ownership mais inputs validés).

### [CRITICAL] JWT secret fallback en clair
`'SECRET_KEY_DEV_ONLY'` est codé en dur comme repli dans `auth.module.ts:13` **et** `jwt.strategy.ts:11`. En cas d'oubli de `JWT_SECRET` en production, l'application tournera avec un secret public connu — bypass complet possible.
**Action** : `throw` au démarrage si `JWT_SECRET` est absent (via `ConfigService` et fail-fast).

### [HIGH] Aucune validation `class-validator` sur les DTO
Le README impose `class-validator` sur tous les DTO (`README.md:33`), mais aucun DTO ne l'utilise :
- `auth.controller.ts:10-17` reçoit `Record<string, any>` (pas même un DTO)
- `users/dto/update-profile.dto.ts:1-4`, `users/dto/update-password.dto.ts:1-4` : champs nus, sans décorateurs
- `workflows/dto/create-workflow.dto.ts:1-4`, `update-workflow.dto.ts:1-7` : `definition: any` sans `@IsObject()`, `name: string` sans `@MinLength()`
**Action** : installer `class-validator`+`class-transformer`, activer `ValidationPipe` global dans `main.ts`, annoter chaque DTO.

### [HIGH] Pas de Swagger malgré l'exigence README
README impose "Décorateurs Swagger sur chaque endpoint" (`README.md:34`). Aucun `@nestjs/swagger` dans `package.json`, aucun `SwaggerModule.setup` dans `main.ts:1-21`.
**Action** : `npm i @nestjs/swagger`, monter `/api/docs`, annoter contrôleurs.

### [HIGH] Forgot password non implémenté
`ForgotPasswordForm.tsx:25` → `console.log('Reset password request', { email });` puis `// TODO: Connect to backend`. Aucun endpoint backend ; le bouton "Envoyer le lien" ne fait rien d'utile mais le UX laisse croire le contraire.
**Action** : soit cacher l'option, soit créer `/api/auth/forgot-password` + email (Mailtrap/Resend) + token court-vivant.

### [HIGH] Formulaire de contact factice
`pages/ContactPage.tsx:10-14` → `handleSubmit` ne fait que `setSent(true)`. Aucun envoi réel. Le message "Nous reviendrons vers vous dès que possible" est trompeur.
**Action** : route backend (`/api/contact` + nodemailer ou simple `mailto:`) ou désactiver le formulaire.

### [HIGH] Ownership manquant côté `findAll` versus `findOne`
`findAll` filtre bien `where: { userId }` (`workflows.service.ts:24-28`) mais comme indiqué, `findOne` n'a pas ce filtre — incohérence directe avec la sécurité. (Voir CRITICAL.)

### [MEDIUM] Migration Prisma désynchronisée avec le schéma
La migration unique `20260108100742_init/migration.sql:13-22` crée `Workflow` avec **uniquement** `id, name, userId, definition, createdAt, updatedAt` — mais le schéma actuel a `description`, `category`, `webhookPath`, `isPublic` (`schema.prisma:25-37`). Soit le seed/Prisma push a été utilisé localement sans générer la migration correspondante, soit la prod tourne avec un schéma divergent.
**Action** : `npx prisma migrate dev --name add_gallery_fields` pour générer la migration manquante puis déployer.

### [MEDIUM] CORS hardcodé sur l'IP
`main.ts:9-16` liste en dur `http://217.182.204.220:3000`. Pas de configuration via env. Identique pour `VITE_API_URL` dans `.env.production:1` et `deploy-frontend.yml:50`.
**Action** : remplacer par `process.env.FRONTEND_ORIGIN` (ou tableau séparé par virgule) ; supprimer la duplication entre `.env.production` et build-args CI.

### [MEDIUM] `.env.development` annoncé mais absent
CLAUDE.md mentionne `.env.development` (`VITE_API_URL=http://localhost:3001/api`). Seul `.env.production` existe (`find .env*` confirme). Le fallback dans `api.ts:1` masque le problème, mais le build dev produit silencieusement la mauvaise URL si on touche au défaut.

### [MEDIUM] `packages/shared` inutilisé
`packages/shared/src/index.ts` = `export {}`. Le README (`README.md:28`) le présente comme la source des DTOs partagés ; rien n'est partagé en réalité. Frontend redéfinit ses propres interfaces (`PublicWorkflow` dans `WorkflowRunPage.tsx:15-23`).

### [MEDIUM] Tests quasi-inexistants
- `app.controller.spec.ts:17-21` teste seulement `"Hello World!"`.
- `test/app.e2e-spec.ts:19-25` idem (route `/`).
- Aucun test pour auth, users, workflows, n8n. Aucun test E2E (Playwright/Cypress mentionnés en `.agent/rules/persona.md:351`).

### [MEDIUM] Éditeur ReactFlow décoratif uniquement
`pages/WorkflowEditorPage.tsx` + `components/workflow/FlowCanvas.tsx` + `Sidebar.tsx` permettent du drag-drop, mais aucun bouton "Enregistrer", aucune persistance via `api.createWorkflow`, aucune ouverture d'un workflow existant. La nav latérale "⚡ Workflows" mène à une page non terminée.

### [MEDIUM] Liens "Voir la démo", "Fonctionnalités", "Intégrations", "Documentation", "Tutoriels"
- `Navbar.tsx:46` → `<Link to="#">` ("Fonctionnalités")
- `Hero.tsx:61-75` → bouton "Voir la démo" sans onClick
- `Footer.tsx:94,100,101,110` → 4 liens `to="#"` + lien Confidentialité footer pointe `#` au lieu de `/confidentialite`

### [MEDIUM] Validation backend insuffisante pour `signUp`
La regex email `auth.service.ts:32` accepte un TLD `[a-zA-Z]{2,}` mais le frontend la borne à `{2,6}` (`LoginForm.tsx:22`, `SignupForm.tsx:26`, `ForgotPasswordForm.tsx:12`). Inconsistance : `.museum` (6) passe mais `.travel` (6) ok, `.community` non — exclusion arbitraire et différente côté front/back.

### [LOW] DTOs `definition: any`
`CreateWorkflowDto.definition: any` (`workflows/dto/create-workflow.dto.ts:3`) : pas de type sûr. Idéalement `definition: Prisma.JsonValue` ou schéma Zod.

### [LOW] Email verification désactivée
`SignupForm.tsx:19,79-121` : tout le flux "vérifier vos emails" est en commentaire. Soit livrer, soit retirer pour clarifier.

### [LOW] 2FA placeholder
`SecuritySettings.tsx:93-100` affiche "2FA désactivé" + bouton "Activer" sans handler.

### [LOW] `console.log("App mounting...")` en production
`main.tsx:6` — bruit dans la console prod.

### [LOW] `Toast` id via `Math.random().toString(36).substr(2,9)`
`ToastContext.tsx:20` — `substr` déprécié, préférer `substring` (ou `crypto.randomUUID()`).

### [LOW] `console.log` debug dans `ForgotPasswordForm.tsx:25`

### [LOW] Pas de rate-limiting
Aucune protection brute-force sur `/api/auth/login` (cf. `.agent/rules/persona.md:384`). Aucune dépendance `@nestjs/throttler`.

### [LOW] Pas de HTTPS (assumé)
CLAUDE.md note "Pas de HTTPS pour cette année" — acceptable côté projet académique mais à signaler aux mentions légales.

## 6. 🐛 Issues & Technical Debt (exact quotes + file paths)

| # | Fichier:Ligne | Citation | Problème |
|---|---|---|---|
| 1 | `auth/auth.module.ts:13` | `secret: process.env.JWT_SECRET \|\| 'SECRET_KEY_DEV_ONLY', // TODO: Move to .env` | Fallback secret en dur ; TODO ouvert. |
| 2 | `auth/jwt.strategy.ts:11` | `secretOrKey: process.env.JWT_SECRET \|\| 'SECRET_KEY_DEV_ONLY'` | Même fallback dupliqué. |
| 3 | `workflows/workflows.controller.ts:33` | `findOne(@Param('id') id: string) { return this.workflowsService.findOne(id); }` | Aucun contrôle d'ownership (CRITICAL). |
| 4 | `workflows/workflows.controller.ts:39` | `update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto)` | Idem update/remove/run. |
| 5 | `workflows/workflows.service.ts:14-22` | `create(userId, …) { data: { name, definition, userId } }` | N'expose pas `description/category/webhookPath/isPublic` ; un user ne peut donc pas créer un workflow exécutable. |
| 6 | `auth/auth.controller.ts:10-16` | `signIn(@Body() signInDto: Record<string, any>)` | Pas de DTO typé ni validation, contrairement au standard README. |
| 7 | `main.tsx:6` | `console.log("App mounting...");` | Log de debug en prod. |
| 8 | `ForgotPasswordForm.tsx:25-26` | `console.log('Reset password request', { email }); // TODO: Connect to backend` | Feature factice. |
| 9 | `SignupForm.tsx:19` | `// const [isSuccess, setIsSuccess] = useState(false); // TODO: Re-enable with email verification` | Verification email morte. |
| 10 | `SignupForm.tsx:102` | `// TODO: Activate when email verification service is configured` | Idem. |
| 11 | `Navbar.tsx:46` | `<Link to="#" style={linkStyle}>Fonctionnalités</Link>` | Lien mort. |
| 12 | `Footer.tsx:94/100/101/110` | `<Link to="#" …>` (Intégrations, Documentation, Tutoriels, Confidentialité) | 4 liens morts. |
| 13 | `ContactPage.tsx:10-14` | `setSent(true);` | Soumission factice. |
| 14 | `DashboardPage.tsx:44-45` | `<StatCard title="Exécutions (24h)" value="—" …>` | Cartes stats placeholders. |
| 15 | `prisma/migrations/20260108100742_init/migration.sql:13-22` | Crée `Workflow` sans `description/category/webhookPath/isPublic` | Migration absente pour les colonnes utilisées en code. |
| 16 | `packages/shared/src/index.ts:2` | `export { };` | Package partagé vide. |
| 17 | `main.ts:9-16` | `'http://217.182.204.220:3000'` | IP hardcodée dans CORS. |
| 18 | `Toast.tsx` (via context) `ToastContext.tsx:20` | `Math.random().toString(36).substr(2, 9)` | `substr` déprécié. |
| 19 | `.gitignore:1-4` | `node_modules\n.DS_Store\n.env\nnode_modules` | Doublon ; ne couvre pas `apps/*/node_modules` explicitement (npm gère ok mais propre à corriger). |
| 20 | `SignupForm.tsx:26` / `LoginForm.tsx:22` / `auth.service.ts:32` | regex email divergentes `{2,6}` vs `{2,}` | Validation incohérente front/back. |

## 7. 🧪 Test Coverage Assessment

| Aspect | État |
|---|---|
| Tests unitaires backend | 1 fichier — `app.controller.spec.ts` teste `getHello()` "Hello World!". **0 %** sur auth, users, workflows, n8n. |
| Tests e2e backend | 1 fichier — `test/app.e2e-spec.ts` teste `GET /` → "Hello World!". Ne couvre rien de l'API métier. |
| Tests frontend | **Aucun** : pas de Vitest/Jest, pas de Playwright/Cypress, pas de fichier `*.test.*` ni `*.spec.*` côté `apps/frontend`. |
| Couverture globale estimée | **< 1 %** des chemins métiers. |

Aucune CI ne lance de tests : les workflows GitHub Actions se contentent de build+push Docker (`deploy-frontend.yml`, `deploy-backend.yml`). Risque élevé de régression silencieuse — d'autant que Watchtower redéploie automatiquement.

## 8. 📈 Top 5 Recommendations (by impact/effort ratio)

1. **Verrouiller l'ownership Workflow (1-2 h, énorme impact sécurité)** — Modifier `WorkflowsService.findOne/update/remove/run` pour exiger `userId` (excepté `run` sur workflows `isPublic`). Branché en quelques lignes (`prisma.workflow.findFirst({ where: { id, userId } })` + `NotFoundException`). Élimine la fuite cross-user immédiatement.

2. **Fail-fast sur `JWT_SECRET` + ValidationPipe global (1 h, sécurité + cleanup)** — Dans `main.ts`, valider via `ConfigService.getOrThrow('JWT_SECRET')` ; supprimer les deux fallbacks `'SECRET_KEY_DEV_ONLY'`. Ajouter `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`. Permet d'enchaîner la 3e recommandation.

3. **Adopter `class-validator` + Swagger (3-4 h, conforme au README)** — Annoter les 6 DTOs (`@IsEmail`, `@MinLength(8)`, `@IsString`, `@IsOptional`, etc.), remplacer `Record<string, any>` dans `AuthController` par `LoginDto`/`SignupDto`. Installer `@nestjs/swagger`, brancher `/api/docs`. Bonus : tests partiels d'API automatiques via le contrat OpenAPI.

4. **Générer la migration Prisma manquante (15 min, évite divergence prod)** — `npx prisma migrate dev --name add_gallery_fields`. Sans ça, n'importe quelle reconstruction du conteneur à partir de zéro échouera ou créera une DB incohérente. À déployer avant tout nouveau VPS / restauration.

5. **Câbler ou cacher les features fantômes (2-3 h, crédibilité produit)** — Retirer ou désactiver : "Voir la démo", "2FA activer", "Forgot password", "Contact form". Supprimer les `<Link to="#">` du Navbar/Footer ou les rediriger vers les sections existantes. Ces "morts" donnent l'impression d'un produit non fini lors de la démo jury.

## 9. 🔍 Key Files Reference

| File | Role |
|------|------|
| `frontend/apps/backend/src/main.ts` | Bootstrap NestJS — prefix `/api`, CORS, port 3001 |
| `frontend/apps/backend/src/app.module.ts` | Assemble Auth/Users/Workflows/N8n + ConfigModule global |
| `frontend/apps/backend/src/auth/auth.service.ts` | signUp (validation + bcrypt) / signIn (compare + sign JWT 2h) |
| `frontend/apps/backend/src/auth/jwt.strategy.ts` | Stratégie Passport JWT (Bearer) |
| `frontend/apps/backend/src/auth/jwt-auth.guard.ts` | Guard `@UseGuards(JwtAuthGuard)` |
| `frontend/apps/backend/src/users/users.service.ts` | findById/findOne/create/updateProfile/updatePassword (bcrypt re-hash) |
| `frontend/apps/backend/src/users/users.controller.ts` | `/api/users/me` (GET/PUT/me/password) — strip `password` |
| `frontend/apps/backend/src/workflows/workflows.controller.ts` | `/api/workflows` + `/public` + `/:id/run` |
| `frontend/apps/backend/src/workflows/workflows.service.ts` | CRUD + délégation `n8nService.executeWebhook` |
| `frontend/apps/backend/src/n8n/n8n.service.ts` | Wrapper axios n8n REST + webhook |
| `frontend/apps/backend/prisma/schema.prisma` | Modèles User, Workflow (gallery fields inclus) |
| `frontend/apps/backend/prisma/seed.ts` | Crée 2 workflows publics démo |
| `frontend/apps/backend/prisma/migrations/20260108100742_init/migration.sql` | Schéma init **désynchronisé** (manque gallery fields) |
| `frontend/apps/backend/Dockerfile` | Build NestJS standalone (Node 18-alpine), expose 3001 |
| `frontend/apps/frontend/src/App.tsx` | Définition routes (publiques, auth, protégées sous `/app`) |
| `frontend/apps/frontend/src/services/api.ts` | Client HTTP + `ApiError` + JWT auto |
| `frontend/apps/frontend/src/context/AuthContext.tsx` | login/signup/logout, persistance local/session, expiration JWT |
| `frontend/apps/frontend/src/components/RouteGuards.tsx` | ProtectedRoute / PublicRoute |
| `frontend/apps/frontend/src/pages/GalleryPage.tsx` | Liste workflows publics |
| `frontend/apps/frontend/src/pages/WorkflowRunPage.tsx` | Formulaire dynamique + appel `runWorkflow` + `WorkflowResult` |
| `frontend/apps/frontend/src/components/workflow/WorkflowResult.tsx` | États loading/erreur/résultat (+ copie + relancer) |
| `frontend/apps/frontend/src/layouts/DashboardLayout.tsx` | Sidebar + header dashboard (responsive) |
| `frontend/apps/frontend/Dockerfile` | Multi-stage Node → Nginx (SPA) |
| `frontend/apps/frontend/nginx.conf` | Fallback SPA + cache statique |
| `frontend/apps/frontend/.env.production` | `VITE_API_URL=http://217.182.204.220:3001/api` |
| `frontend/docker-compose.yml` | Postgres 16 dev local |
| `.github/workflows/deploy-frontend.yml` | Build + push GHCR (paths `frontend/apps/frontend/**`) |
| `.github/workflows/deploy-backend.yml` | Build + push GHCR (paths `frontend/apps/backend/**`) |
| `.agent/rules/persona.md` | Sprint plan (référence historique des specs) |
| `CLAUDE.md` | Instructions repo (vue d'ensemble, conventions, état d'avancement) |
