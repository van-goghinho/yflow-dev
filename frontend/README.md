# Y'flow

## 1. Présentation Globale
**Nom du Projet** : Y'flow

**Concept** : Plateforme web d'automatisation intelligente rendant la puissance de n8n et Mistral AI accessible via une interface simplifiée (No-Code).

**Innovation Clé** : Couche d'abstraction UX/UI permettant d'activer des workflows complexes via des formulaires métier, sans manipuler de nœuds techniques.

## 2. Équipe du Projet
- **BONSENS Ilian** : Chef de Projet & Lead Developer
- **Sophie AHOLOU** : Ingénierie IA & Data
- **Prosper ADDAI** : Développement (Consultant)
- **Lucas BENDIA, Florian COILLET-MATILLON, Baptiste EMMANUELLI** : Infrastructure
- **Mayssa HAMDAOUI, Anasi NIYONKURU** : Cybersécurité

## 3. Architecture Technique (Dev Focus)
- **Structure** : Monorepo TypeScript
- **Backend** : NestJS (Framework robuste, architecture modulaire)
- **Frontend** : Vite (React ou Vue.js) pour une interface réactive
- **ORM & Database** : Prisma ORM avec PostgreSQL
- **Orchestration** : Communication bidirectionnelle avec l'API REST de n8n Community Edition
- **IA** : Intégration directe de l'API Mistral AI

## 4. Organisation du Code
- `apps/backend/` : Logique d'orchestration, API REST, connecteurs n8n
- `apps/frontend/` : Galerie de workflows et formulaires utilisateurs
- `packages/shared/` : Types, interfaces et DTOs (Data Transfer Objects) partagés

## 5. Standards de Développement (Conventions)
- **Strict Typing** : Utilisation obligatoire de TypeScript sur l'ensemble de la stack.
- **Validation** : Décorateurs `class-validator` sur tous les DTOs.
- **Documentation** : Décorateurs Swagger sur chaque endpoint du contrôleur.
- **Architecture** : Séparation stricte entre les Contrôleurs (entrées/sorties) et les Services (logique métier).
- **Sécurité** : Gestion des configurations via `@nestjs/config` (fichiers .env).