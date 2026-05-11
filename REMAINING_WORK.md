# Y'Flow — Plan de complétion technique

> Date : 2026-05-11. État évalué contre les conventions du projet (`frontend/README.md` §5, `CLAUDE.md` §État d'avancement) et les bonnes pratiques NestJS/sécurité standard.

---

## Verdict

🔴 **Le projet n'est PAS prêt techniquement.**

Le parcours alpha (signup → galerie → exécution workflow → résultat) fonctionne. Mais il existe :
- **2 défauts CRITIQUES de sécurité** (cf. P0) qu'une revue de code détecterait immédiatement.
- **2 conventions du projet non respectées** alors qu'elles sont écrites dans le README du repo (cf. P1) : `class-validator` sur les DTO, Swagger sur les endpoints.
- **1 migration Prisma désynchronisée** du schéma (cf. P1) — un déploiement à partir d'une DB vide produirait une DB incohérente.
- **Plusieurs features visibles mais factices** (cf. P2) — bouton mot de passe oublié, formulaire de contact, éditeur ReactFlow non sauvegardable, statistiques placeholder.
- **Quasi-zéro test sur le métier** (cf. P4).

Effort estimé pour passer "prêt" : **~12 h** (P0 + P1 + P3) ; **~22 h** avec tests (P0 → P4). Détails ci-dessous.

---

## P0 — Bloquants sécurité (≤ 2 h)

### P0.1 Verrouiller l'ownership des workflows
**Pourquoi** : aujourd'hui, n'importe quel utilisateur authentifié peut lire/modifier/supprimer/exécuter le workflow d'un autre utilisateur s'il en devine l'UUID.
**Fichiers** : `frontend/apps/backend/src/workflows/workflows.controller.ts`, `frontend/apps/backend/src/workflows/workflows.service.ts`.

**Étapes** :
1. Dans `workflows.controller.ts:32-53`, passer `req.user.sub` à chaque handler protégé :
   ```ts
   @Get(':id')
   findOne(@Request() req: any, @Param('id') id: string) {
     return this.workflowsService.findOne(id, req.user.sub);
   }
   ```
2. Dans `workflows.service.ts`, modifier `findOne`, `update`, `remove` :
   ```ts
   async findOne(id: string, userId: string) {
     const wf = await this.prisma.workflow.findFirst({ where: { id, userId } });
     if (!wf) throw new NotFoundException('Workflow introuvable');
     return wf;
   }
   ```
3. Pour `run` : autoriser si `isPublic === true` (galerie publique) sinon vérifier `userId`.
4. Compléter `WorkflowsService.create` pour accepter et persister `description`, `category`, `webhookPath`, `isPublic` (aujourd'hui ignorés).

**Vérification** :
- Créer 2 users U1/U2. U1 crée un workflow. U2 (avec son JWT) tente `GET/PUT/DELETE/POST run` sur l'UUID du workflow de U1 → doit recevoir 404.
- U2 peut toujours exécuter un workflow public via `POST /api/workflows/:id/run`.

### P0.2 Fail-fast sur `JWT_SECRET`
**Pourquoi** : `'SECRET_KEY_DEV_ONLY'` est codé en dur en repli (`auth.module.ts:13` et `jwt.strategy.ts:11`). Si la variable d'env est oubliée en prod, l'app tourne avec un secret public connu → bypass total.

**Étapes** :
1. Dans `main.ts`, après `NestFactory.create`, valider `process.env.JWT_SECRET` (longueur min 32) ; sinon `throw`.
2. Remplacer les deux fallbacks `|| 'SECRET_KEY_DEV_ONLY'` par une référence directe à `process.env.JWT_SECRET!`.
3. Alternative propre : convertir `AuthModule` en `JwtModule.registerAsync({ inject: [ConfigService], useFactory: c => ({ secret: c.getOrThrow('JWT_SECRET'), … }) })` et idem pour `JwtStrategy` (via DI).

**Vérification** : `unset JWT_SECRET; npm run start:dev` → l'app refuse de démarrer.

---

## P1 — Conventions du projet (≤ 4 h)

Le `README.md` (`§5 Standards de Développement`) impose explicitement :
- Validation `class-validator` sur tous les DTO.
- Décorateurs Swagger sur chaque endpoint.

Aujourd'hui, **aucun** des deux n'est en place.

### P1.1 `class-validator` + `ValidationPipe` global
**Fichiers** : `frontend/apps/backend/package.json`, `frontend/apps/backend/src/main.ts`, tous les fichiers `dto/*.ts`, `auth/auth.controller.ts`.

**Étapes** :
1. `cd frontend/apps/backend && npm i class-validator class-transformer`.
2. Dans `main.ts` ajouter :
   ```ts
   app.useGlobalPipes(new ValidationPipe({
     whitelist: true,
     forbidNonWhitelisted: true,
     transform: true,
   }));
   ```
3. Remplacer `Record<string, any>` dans `auth.controller.ts:10,15` par des DTOs typés :
   - `auth/dto/login.dto.ts` : `email: @IsEmail()`, `password: @IsString() @MinLength(8)`.
   - `auth/dto/signup.dto.ts` : idem + `name: @IsString() @MinLength(2)`.
4. Annoter `users/dto/update-profile.dto.ts` : `@IsOptional() @IsString() @MinLength(2) name`, `@IsOptional() @IsEmail() email`.
5. Annoter `users/dto/update-password.dto.ts` : `@IsString() @MinLength(8) newPassword`, `@IsString() currentPassword`.
6. Annoter `workflows/dto/create-workflow.dto.ts` : `@IsString() name`, `@IsObject() definition`, + champs galerie optionnels (`description`, `category`, `webhookPath`, `isPublic`).
7. Supprimer la validation manuelle dans `auth.service.ts:31-41` (devient redondante).

**Vérification** : `POST /api/auth/register` avec `{ email: "x", password: "1" }` → 400 avec liste d'erreurs validation.

### P1.2 Swagger
**Fichiers** : `frontend/apps/backend/package.json`, `frontend/apps/backend/src/main.ts`, tous les contrôleurs.

**Étapes** :
1. `npm i @nestjs/swagger`.
2. Dans `main.ts` :
   ```ts
   const config = new DocumentBuilder()
     .setTitle("Y'Flow API")
     .setVersion('0.1')
     .addBearerAuth()
     .build();
   const doc = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api/docs', app, doc);
   ```
3. Annoter chaque contrôleur : `@ApiTags('auth')`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth()` sur les routes protégées.
4. Annoter chaque DTO avec `@ApiProperty()` (utiliser le plugin CLI `@nestjs/swagger` dans `nest-cli.json` pour automatiser).

**Vérification** : `http://localhost:3001/api/docs` charge l'UI Swagger avec toutes les routes documentées.

### P1.3 Régénérer la migration Prisma
**Pourquoi** : la migration `20260108100742_init/migration.sql` crée `Workflow` sans `description / category / webhookPath / isPublic`, alors que ces colonnes existent dans `schema.prisma` et sont utilisées en code. Une DB neuve serait cassée.

**Étapes** :
1. Sur une DB **de test** (pas la prod) : `cd frontend/apps/backend && npx prisma migrate dev --name add_gallery_fields`.
2. Commit le fichier généré dans `prisma/migrations/<timestamp>_add_gallery_fields/`.
3. En prod : `npx prisma migrate deploy` (additif, sans drop).

**Vérification** : depuis une DB vide, `npx prisma migrate deploy && npx prisma db seed` se termine sans erreur ; `psql -c "\d \"Workflow\""` montre les 4 colonnes.

---

## P2 — Features factices / incomplètes (≤ 4 h)

### P2.1 Mot de passe oublié
**Choix à faire** : implémenter ou retirer du UI.
- **Retirer (15 min)** : dans `LoginForm.tsx:120-128`, supprimer le lien "Mot de passe oublié ?" + supprimer `AuthView 'FORGOT_PASSWORD'` dans `AuthPage.tsx:8,57-58` + supprimer `ForgotPasswordForm.tsx`.
- **Implémenter (4 h)** : endpoint `POST /api/auth/forgot-password { email }` → générer token court-vivant (UUID + expiry stocké en DB, nouveau modèle `PasswordResetToken`) → envoyer un mail (Resend / SMTP / mailtrap). Endpoint `POST /api/auth/reset-password { token, newPassword }`.

### P2.2 Formulaire de contact
**Fichier** : `frontend/apps/frontend/src/pages/ContactPage.tsx:10-14`.
**Aujourd'hui** : `handleSubmit` ne fait que `setSent(true)` — le user croit que son message a été envoyé.

**Choix à faire** :
- **Retirer (10 min)** : remplacer le `<form>` par un simple lien `mailto:yflowprojet@gmail.com`.
- **Implémenter (2 h)** : endpoint `POST /api/contact { name, email, message }` qui envoie un mail via nodemailer.

### P2.3 Éditeur ReactFlow non sauvegardable
**Fichiers** : `frontend/apps/frontend/src/pages/WorkflowEditorPage.tsx`, `components/workflow/FlowCanvas.tsx`.
**Aujourd'hui** : `/app/workflows` charge un éditeur avec drag-drop mais aucun bouton enregistrer ; les sidebar items (Webhook Web, Mistral AI, Requête HTTP, Envoyer Email) ne mènent à rien.

**Choix à faire** :
- **Cacher (15 min)** : retirer "⚡ Workflows" de la sidebar (`layouts/DashboardLayout.tsx:79-81`) ou la rediriger vers `/app/gallery`. Garder le code pour plus tard.
- **Finaliser (4 h)** : ajouter un bouton "Enregistrer" dans `WorkflowEditorPage` qui appelle `api.createWorkflow({ name, definition: { nodes, edges } })` ; afficher la liste des workflows utilisateur ; permettre l'édition/suppression.

### P2.4 Statistiques Dashboard placeholder
**Fichier** : `frontend/apps/frontend/src/pages/DashboardPage.tsx:44-45`.
**Aujourd'hui** : cartes "Exécutions (24h)" et "Taux de succès" affichent `—` en dur.

**Choix à faire** :
- **Retirer (5 min)** : supprimer les 2 cartes.
- **Implémenter (2 h)** : endpoint backend `GET /api/workflows/stats` qui interroge `n8nService.listExecutions` (à ajouter), calcule total + succès des dernières 24h. Mettre à jour `services/api.ts`.

### P2.5 Liens morts UI
**Fichiers** :
- `frontend/apps/frontend/src/components/Navbar.tsx:46` — "Fonctionnalités" → `to="#"`.
- `frontend/apps/frontend/src/components/Footer.tsx:94,100,101,110` — "Intégrations", "Documentation", "Tutoriels", "Confidentialité" → `to="#"`.
- `frontend/apps/frontend/src/components/landing/Hero.tsx:61-75` — bouton "Voir la démo" sans `onClick`.

**Action (20 min)** : soit pointer vers les sections / pages réelles, soit retirer. Pour "Confidentialité" du footer, pointer vers `/confidentialite` (la page existe). "Voir la démo" → scroll vers `#features` ou ouvrir un fichier vidéo.

### P2.6 2FA placeholder
**Fichier** : `frontend/apps/frontend/src/components/settings/SecuritySettings.tsx:93-100`.
**Action (5 min)** : retirer ou marquer "Bientôt disponible" (désactiver le bouton).

---

## P3 — Hygiène code (≤ 1 h)

### P3.1 `console.log` debug
- `frontend/apps/frontend/src/main.tsx:6` — `console.log("App mounting...")`.
- `frontend/apps/frontend/src/components/ForgotPasswordForm.tsx:25` — `console.log('Reset password request', ...)` (sera retiré avec P2.1).

### P3.2 `String.prototype.substr` déprécié
- `frontend/apps/frontend/src/context/ToastContext.tsx:20` — remplacer par `crypto.randomUUID()` (ou `substring`).

### P3.3 `.env.development` manquant
**Fichier à créer** : `frontend/apps/frontend/.env.development`
```
VITE_API_URL=http://localhost:3001/api
```
Sans ce fichier, `npm run dev` repose sur le fallback dans `services/api.ts:1` — fragile si quelqu'un modifie le défaut.

### P3.4 CORS hardcodé
**Fichier** : `frontend/apps/backend/src/main.ts:9-16`.
**Action** : remplacer la liste hardcodée par `process.env.CORS_ORIGINS?.split(',') ?? [...]` + documenter dans `.env.example`.

### P3.5 Regex email divergentes
- Backend (`auth/auth.service.ts:32`) : `{2,}`
- Frontend (`LoginForm.tsx:22`, `SignupForm.tsx:26`, `ForgotPasswordForm.tsx:12`) : `{2,6}`

**Action** : aligner (préférer `{2,}` partout) ou centraliser dans `packages/shared` (cf. P3.6). Mieux : avec P1.1 en place, supprimer côté backend (`@IsEmail()` couvre déjà tout). Côté frontend, garder une validation simple HTML5 `type="email"` + un check minimaliste.

### P3.6 `packages/shared` vide
**Fichier** : `frontend/packages/shared/src/index.ts` = `export {}`.

**Action** : soit y exporter les DTOs/interfaces partagées (cibles : `PublicWorkflow`, `WorkflowInput`, `LoginDto`, `SignupDto`) et les importer côté front + back, soit retirer le package entièrement de `package.json` workspaces.

---

## P4 — Tests (≤ 8 h)

### P4.1 Tests unitaires backend
Aujourd'hui : seul `app.controller.spec.ts` teste `Hello World!`.

**À écrire** (`*.spec.ts` à côté de chaque service) :
- `auth/auth.service.spec.ts` : signUp avec email valide/invalide, signIn 401 sur mauvais mot de passe, hash bcrypt vérifiable.
- `users/users.service.spec.ts` : updatePassword 401 si current incorrect, update profile.
- `workflows/workflows.service.spec.ts` : findOne refuse 404 si userId ne correspond pas (vérifie P0.1), run avec mock `N8nService`.
- `n8n/n8n.service.spec.ts` : mock axios via `nock` ou `jest.spyOn(httpService, 'post')`.

**Commande** : `npm run test` (déjà configuré).
**Cible** : ≥ 70 % de couverture sur `src/auth`, `src/users`, `src/workflows`.

### P4.2 Tests e2e backend
Aujourd'hui : seul `test/app.e2e-spec.ts` teste `GET /` → "Hello World!".

**À écrire** dans `test/` :
- `auth.e2e-spec.ts` : POST /api/auth/register, POST /api/auth/login, vérifier que /api/users/me sans token = 401, avec token = 200.
- `workflows.e2e-spec.ts` : créer 2 users, l'un crée un workflow, l'autre tente CRUD dessus → 404 (vérifie P0.1).

**Setup** : utiliser `@nestjs/testing` + une DB de test via `docker compose -f docker-compose.test.yml` (à créer) ou Testcontainers.

### P4.3 Tests e2e frontend (Playwright)
Aucun aujourd'hui.

**Setup** :
```bash
cd frontend/apps/frontend
npm i -D @playwright/test
npx playwright install --with-deps chromium
```

**À écrire** :
- `e2e/auth.spec.ts` : signup → login → voir le dashboard → logout.
- `e2e/gallery.spec.ts` : login → galerie → click "Utiliser" sur Résumé IA → remplir → soumettre → voir le résultat. Mock le backend ou utiliser un fixture DB.
- `e2e/protected-routes.spec.ts` : naviguer vers `/app` sans token → redirigé vers `/auth`.

---

## P5 — Reporté (post-livraison) — non bloquant

- **Rate limiting** : `@nestjs/throttler` sur les routes auth (cf. `.agent/rules/persona.md:384`).
- **Email verification** : flow déjà commenté dans `SignupForm.tsx:79-121`, prêt à être réactivé une fois un service mail branché.
- **HTTPS + domaine** : Let's Encrypt via NPM (acknowledged comme reporté dans `CLAUDE.md`).
- **Observabilité** : logger structuré (`pino-http` côté NestJS), métriques d'exécutions n8n.
- **CSP** : header strict pour réduire la surface XSS (vu que JWT en `localStorage`).

---

## Ordre d'exécution recommandé

```
P0.1  Ownership                 1h   ← bloquant sécurité
P0.2  JWT_SECRET fail-fast      30m  ← bloquant sécurité
P1.3  Migration Prisma          15m  ← bloque tout déploiement à froid
P1.1  class-validator           2h   ← convention README
P1.2  Swagger                   2h   ← convention README
P2.5  Liens morts               20m  ← polish visible jury
P2.1  Forgot password (option retirer) 15m
P2.2  Contact form (option retirer)    10m
P2.3  Editor (option cacher)            15m
P2.4  Dashboard stats (option retirer)   5m
P2.6  2FA placeholder            5m
P3.x  Hygiène                   1h
─────────────────────────────────────
                  Total P0→P3 : ~8h pour "prêt fonctionnel"
P4    Tests                    6-8h pour "prêt robuste"
```

---

## Checklist de validation manuelle (après P0+P1+P2)

À faire dans cet ordre, après chaque étape vérifier l'absence d'erreur dans la console navigateur et les logs backend.

### Auth
- [ ] `POST /api/auth/register` avec payload invalide → 400 + message validation (P1.1).
- [ ] `POST /api/auth/register` avec email déjà utilisé → 409.
- [ ] `POST /api/auth/login` avec mauvais mot de passe → 401, message neutre.
- [ ] Login OK retourne `access_token` + `user`.
- [ ] App refuse de démarrer sans `JWT_SECRET` (P0.2).

### Ownership workflow (P0.1)
- [ ] Créer 2 utilisateurs U1 et U2.
- [ ] U1 crée un workflow privé W1.
- [ ] U2 (avec son JWT) tente `GET /api/workflows/<W1.id>` → 404.
- [ ] U2 tente `PUT /api/workflows/<W1.id>` → 404.
- [ ] U2 tente `DELETE /api/workflows/<W1.id>` → 404.
- [ ] U2 tente `POST /api/workflows/<W1.id>/run` → 404.
- [ ] U2 peut `POST /api/workflows/wf-resume-ia/run` (public) → 200.

### Galerie → exécution
- [ ] `GET /api/workflows/public` (sans token) retourne 2 workflows.
- [ ] Frontend `/app/gallery` affiche les 2 cartes.
- [ ] Click "Utiliser" sur Résumé IA → ouvre `/app/workflows/wf-resume-ia/run` avec form pré-rempli.
- [ ] Soumettre avec un texte → loading → résultat affiché par `WorkflowResult`.
- [ ] Bouton "Copier" copie dans le presse-papier.
- [ ] Bouton "Relancer" remet le form en état initial.
- [ ] Idem pour le Générateur d'email (avec select tonalité).
- [ ] Si n8n indisponible : message d'erreur clair, pas de stacktrace côté UI.

### Settings
- [ ] Update profil → toast succès, valeur persiste après reload.
- [ ] Update mot de passe avec ancien incorrect → 401, toast erreur.
- [ ] Update mot de passe OK → toast succès, login re-fonctionne avec le nouveau.

### Routes / guards
- [ ] `/app/*` sans token → redirigé vers `/auth`.
- [ ] `/auth` avec token valide → redirigé vers `/app`.
- [ ] Logout → token effacé, redirigé vers `/`.
- [ ] Token expiré (manipuler `exp` ou attendre 2h) → reconnecté forcé au prochain reload.

### Swagger (P1.2)
- [ ] `http://localhost:3001/api/docs` affiche l'UI Swagger.
- [ ] Toutes les routes sont listées avec leurs DTOs.
- [ ] Bouton "Authorize" permet de coller un Bearer token et appeler les routes protégées.

### Migration (P1.3)
- [ ] `docker compose down -v && docker compose up -d` (DB vide).
- [ ] `npx prisma migrate deploy && npx prisma db seed` se termine sans erreur.
- [ ] Tous les workflows démo sont créés et visibles dans `/app/gallery`.

### Pages publiques
- [ ] `/`, `/legal`, `/cgu`, `/confidentialite`, `/contact`, `/auth` rendent sans erreur console.
- [ ] Aucun lien `<a href="#">` / `<Link to="#">` visible (P2.5).

### CI/CD
- [ ] `git push origin <branch-de-test>` ne déclenche **pas** le pipeline (seulement `main`).
- [ ] Push sur `main` → image GHCR build → Watchtower pull → conteneur redéploié en < 10 min.

---

## Quand considérer le projet "prêt"

- ✅ Phases P0, P1, P2 complétées.
- ✅ Checklist de validation manuelle 100 % verte.
- ✅ Au moins quelques tests unitaires sur l'ownership et l'auth (sous-ensemble de P4).
- ✅ `PROJECT_AUDIT.md` revu : aucun item CRITICAL/HIGH ouvert.

À ce stade, l'application est démontrable sans risque, et les conventions du repo sont respectées.
