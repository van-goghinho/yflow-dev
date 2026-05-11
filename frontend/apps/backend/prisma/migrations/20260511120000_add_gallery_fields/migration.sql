-- Ajout des champs galerie au modèle Workflow.
-- IF NOT EXISTS rend le script idempotent : sûr sur une DB neuve comme sur une DB
-- où les colonnes auraient déjà été créées via `prisma db push` (cas de la prod actuelle).

ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "category"    TEXT;
ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "webhookPath" TEXT;
ALTER TABLE "Workflow" ADD COLUMN IF NOT EXISTS "isPublic"    BOOLEAN NOT NULL DEFAULT false;
