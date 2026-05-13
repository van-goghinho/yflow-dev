# Architecture & Choix Techniques — Y'Flow

> Justification de chaque brique du stack, alternatives écartées, trade-offs assumés.

---

## 1. Vue d'ensemble

```
┌────────────────────┐       ┌─────────────────────┐
│  Frontend React    │  JWT  │  Backend NestJS     │
│  Vite + ReactFlow  │◄────► │  /api/* (port 3001) │
│  Nginx (port 3000) │ HTTPS │  Prisma ORM         │
└────────────────────┘       └──────────┬──────────┘
                                        │
              ┌─────────────────────────┤
              │                         │                   
              ▼                         ▼                   
      ┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
      │ PostgreSQL   │         │ n8n (port 5678)  │────────►│  Mistral AI  │
      │ (yflow_dev)  │         │ webhooks + REST  │         │   (API)      │
      └──────────────┘         └──────────────────┘         └──────────────┘

┌────────────────────┐       ┌─────────────────────┐
│  Frontend React    │  JWT  │  Backend NestJS     │
│  Vite + ReactFlow  │◄────► │  /api/* (port 3001) │
│  Nginx (port 3000) │ HTTPS │  Prisma ORM         │
└────────────────────┘       └──────────┬──────────┘
                                        │
              ┌─────────────────────────┤
              │                         │
              ▼                         ▼
      ┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
      │ PostgreSQL   │         │ n8n (port 5678)  │────────►│  Mistral AI  │
      │ (yflow_dev)  │         │ webhooks + REST  │         │   (API)      │
      └──────────────┘         └──────────────────┘         └──────────────┘

═══ Pipeline CI/CD (déploiement automatique) ═══════════════════════════════

   git push main
        │
        ▼
   ┌──────────────────┐                 ┌──────────────┐           ┌──────────────┐
   │  GitHub Actions  │── push image ──►│     GHCR     │── pull ──►│  Watchtower  │
   │                  │                 │  (registry)  │           │  (sur VPS)   │
   └──────────────────┘                 └──────────────┘           └──────┬───────┘
                                                                          │
                                                                          ▼
                                                        redéploie Frontend, Backend, n8n
                                                        (auto, ~5 min, zero downtime)
```

**Principe directeur** : couche d'abstraction métier au-dessus de n8n.
Le backend ne réimplémente pas un moteur de workflow — il *orchestre* n8n via son API REST et expose au frontend une surface simplifiée (`POST /api/workflows/:id/run` avec des inputs métier typés).

## 2. Justification du stack par couche

### 2.1 Frontend — React 19 + Vite + TypeScript

| Critère | Choix | Pourquoi |
|---|---|---|
| Framework UI | **React 19** | Compétence majoritaire de l'équipe ; écosystème mature ; React 19 stabilise les Server Components pour évolution future |
| Bundler | **Vite 7** | HMR < 100 ms ; build de production 10× plus rapide que webpack ; configuration zéro |
| Routing | **react-router-dom 7** | API déclarative `Routes`/`Route`, support `Outlet` pour les layouts (utile pour `/app/*`) |
| Workflow visuel | **ReactFlow 11** | Standard de facto pour les éditeurs nodaux ; permet la roadmap "édition de workflow" sans réinventer drag-and-drop / handles / minimap |
| Icônes | **lucide-react** | Tree-shakable, design system cohérent, alternative open-source à Heroicons |

**Alternatives écartées** :
- **Next.js** : surdimensionné — pas besoin de SSR pour une SPA authentifiée derrière un dashboard. Ajoute une complexité d'hébergement (Node SSR vs simple Nginx).
- **Vue / Svelte** : aurait fragmenté la stack vu les compétences React de l'équipe.

### 2.2 Backend — NestJS 11 + Prisma + PostgreSQL

| Critère | Choix | Pourquoi |
|---|---|---|
| Framework | **NestJS** | Architecture modulaire imposée (`controllers / services / DTOs`), DI native, intégration first-class de Passport/JWT/Swagger/class-validator. Pédagogiquement carré pour un projet année 1. |
| ORM | **Prisma 6** | Schema déclaratif, génération de types TS, migrations versionnées, studio intégré. Le DX surpasse TypeORM/Sequelize. |
| Base de données | **PostgreSQL 18** | Support natif `JSONB` (utilisé pour `Workflow.definition`), contraintes relationnelles propres (`onDelete: Cascade`), partagé avec n8n. |
| Auth | **JWT (`@nestjs/jwt`) + bcrypt** | Stateless (pas de Redis session store), portable, scaling trivial. Bcrypt 10 rounds = standard 2026. |
| HTTP client (vers n8n) | **`@nestjs/axios` (axios + RxJS)** | Wrapping Observable cohérent avec Nest, retry/timeout facile, headers communs centralisés. |

**Alternatives écartées** :
- **Express seul** : aurait nécessité de réinventer DI / middleware / decorators → perte de temps en cadrage architectural.
- **TypeORM** : entity-driven, plus verbeux, moins de garanties sur les migrations.
- **Sessions cookies** : exige un store distribué dès qu'on a 2+ instances ; JWT évite ce piège.
- **Argon2id** : plus moderne que bcrypt mais ajoute une dépendance native peu utile à notre échelle (< 10k users prévus année 1).

### 2.3 Orchestration — n8n Community Edition

| Choix | Justification |
|---|---|
| **n8n** | Moteur de workflows mature, self-hostable, API REST + système de webhooks. Permet à l'équipe IA (Sophie) de construire des workflows complexes (chaîne de prompts, parsing, conditions) sans toucher au backend. |
| **Webhooks** | Un workflow démo = une URL `POST /webhook/<slug>` ; le backend appelle cette URL avec les inputs JSON et reçoit le résultat. Découplage net entre métier (NestJS) et orchestration (n8n). |
| **PostgreSQL partagé** | n8n et le backend NestJS pointent sur le même serveur Postgres (bases distinctes : `n8n_database` vs `yflow_dev`). Évite un deuxième container DB. |

**Alternatives écartées** :
- **Construire notre propre moteur de workflows** : hors-scope d'un projet B3. n8n résout déjà le problème.
- **Make / Zapier** : SaaS payant, pas d'auto-hébergement, contraire au positionnement "RGPD + maîtrise des données".
- **Temporal / Inngest** : sur-ingénierie ; conçus pour des workflows distribués à très forte volumétrie.

### 2.4 IA — Mistral AI (via n8n)

| Critère | Choix | Pourquoi |
|---|---|---|
| LLM | **Mistral Large / Small** | Modèle européen → argumentaire RGPD direct ; rapport qualité/prix > OpenAI sur les usages texte courants ; API simple. |
| Intégration | **Via n8n** | Le node Mistral existe ; les credentials restent dans n8n, pas dans le backend → réduit la surface d'attaque côté API publique. |

**Alternatives écartées** :
- **OpenAI / Anthropic Claude** : excellents mais (1) hébergés hors UE (compliqué RGPD pour le storytelling jury), (2) coût plus élevé pour des cas d'usage simples (résumé, reformulation).
- **Ollama / modèles locaux** : exige un GPU dédié → infra hors-budget projet académique.

### 2.5 Infrastructure

| Brique | Choix | Pourquoi |
|---|---|---|
| Conteneurisation | **Docker** | Standard ; images reproductibles ; déploiement identique dev/prod. |
| Reverse proxy | **Nginx Proxy Manager (NPM)** | UI web pour gérer proxy hosts + Let's Encrypt (à activer quand un domaine sera acheté). Plus accessible qu'un nginx.conf manuel. |
| Auto-deploy | **Watchtower** (label-only) | Pull les images GHCR taggées `latest` toutes les 5 min ; redéploie les conteneurs labellisés. Zéro CI custom côté VPS. |
| Hébergement | **VPS OVHcloud Debian** (217.182.204.220) | Souverain (FR), low-cost (~5 €/mois), suffisant pour la phase démo. |
| CI/CD | **GitHub Actions → GHCR** | Build multi-arch sur push, push image taggée → Watchtower fait le reste. Pipeline complet < 5 min. |

**Alternatives écartées** :
- **Kubernetes** : 100× plus de surface opérationnelle que ce qu'on consomme. Adapté à >10 services ; on en a 4.
- **Vercel / Netlify** : excellent pour le front, mais on perd la cohérence "tout chez OVH + souveraineté".
- **Argo CD / Flux** : surdimensionnés pour un repo unique.

## 3. Architecture applicative (NestJS)

```
src/
├── main.ts                # bootstrap, prefix /api, CORS, port 3001
├── app.module.ts          # composition root
├── prisma/                # @Global — service singleton wrappant PrismaClient
├── auth/                  # signUp/signIn, JwtStrategy (Passport), JwtAuthGuard
├── users/                 # /me (GET/PUT), /me/password (PUT)
├── workflows/             # CRUD + /public + /:id/run (délègue à n8nService)
└── n8n/                   # axios wrapper (executeWebhook, listWorkflows, …)
```

**Règles** (cf. README.md du repo) :
- Toute route métier sous `/api`.
- Routes protégées via `@UseGuards(JwtAuthGuard)` ; `userId` extrait du JWT via `req.user.sub`.
- Mots de passe **jamais** retournés (strip explicite dans `users.controller.ts:17,23`).
- Erreurs HTTP standardisées (`401 UnauthorizedException`, `409 ConflictException`, `404 NotFoundException`).

## 4. Modèle de données

```prisma
model User {
  id        String     @id @default(uuid())
  email     String     @unique
  password  String                       // bcrypt hash
  name      String
  createdAt DateTime   @default(now())
  workflows Workflow[]
}

model Workflow {
  id          String   @id @default(uuid())
  name        String
  description String?                    // affiché en galerie
  category    String?                    // "IA", "Communication", "Productivité"
  webhookPath String?                    // chemin du webhook n8n
  isPublic    Boolean  @default(false)   // visible en galerie
  userId      String
  definition  Json                       // schéma du formulaire (inputs)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Trade-off `definition: Json`** : le contenu n'est pas typé côté DB (Prisma `Json`). On gagne en flexibilité (chaque workflow décrit ses propres inputs) mais on perd la validation au niveau base. Compensation prévue : validation Zod côté service.

**Format actuel d'un `definition`** (exemple Résumé IA) :
```json
{
  "inputs": [
    { "name": "text", "label": "Texte à résumer", "type": "textarea", "required": true }
  ]
}
```

## 5. Flux d'exécution d'un workflow

```
1. User clique "Lancer" sur GalleryPage
   → frontend POST /api/workflows/<id>/run { text: "..." }

2. Backend WorkflowsController.run
   → JwtAuthGuard valide le Bearer token
   → WorkflowsService.run(id, inputs)

3. WorkflowsService.run
   → prisma.workflow.findUnique({ id })   ⚠ ownership check à ajouter (cf. PROJECT_AUDIT.md)
   → n8nService.executeWebhook(workflow.webhookPath, inputs)

4. N8nService.executeWebhook
   → axios POST http://n8n:5678/webhook/<webhookPath>
   → headers X-N8N-API-KEY
   → renvoie response.data

5. n8n exécute le workflow (prompt Mistral, parsing, …) et renvoie { result: "..." }

6. Backend dépaquette et renvoie au frontend
   → { message, workflowId, result }

7. Frontend affiche dans <WorkflowResult />
```

## 6. Trade-offs & dette technique assumée

| Décision | Trade-off | Statut |
|---|---|---|
| Pas de HTTPS année 1 | Données en clair sur le réseau ; acceptable car données non-sensibles + démo pédagogique | Acquis, à corriger avec un domaine |
| Pas de Swagger initial | Ralentit l'intégration côté équipes externes | À activer (cf. audit) |
| Workflows démo seedés (pas créables UI) | UX simplifiée mais ne permet pas encore la création par un user final | Roadmap année 2 |
| Stockage JWT en `localStorage` | Vulnérable au XSS — mais aucune valeur sensible côté front | Acceptable + CSP à ajouter |
| n8n et backend dans le même Postgres | Couplage opérationnel léger | Acceptable à notre échelle |

Voir [`../PROJECT_AUDIT.md`](../PROJECT_AUDIT.md) pour la liste exhaustive des dettes (ownership, validation, tests…).

## 7. Évolutions prévues

1. **Sécurisation** : ownership workflow, `class-validator` + Swagger, `JWT_SECRET` fail-fast, rate-limiting Throttler.
2. **Création de workflows utilisateur** : finaliser l'éditeur ReactFlow (sauvegarde + chargement) → un user pourra créer son propre workflow et le rendre public.
3. **Email transactionnel** : forgot-password + vérification d'email via Resend ou SMTP.
4. **Observabilité** : logger structuré (pino), dashboard n8n d'exécutions, métriques applicatives.
5. **Domaine + HTTPS** : NPM + Let's Encrypt sur `app.yflow.fr`, `api.yflow.fr`, `n8n.yflow.fr`.

---

_Dernière mise à jour : 2026-05-11_
