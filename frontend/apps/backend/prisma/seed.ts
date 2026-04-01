import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@yflow.app' },
    update: {},
    create: {
      email: 'system@yflow.app',
      password: await bcrypt.hash('system-no-login', 10),
      name: "Y'Flow System",
    },
  });

  await prisma.workflow.upsert({
    where: { id: 'wf-resume-ia' },
    update: {},
    create: {
      id: 'wf-resume-ia',
      name: 'Résumé IA',
      description:
        "Résumez n'importe quel texte en quelques phrases grâce à Mistral AI. Collez votre texte et obtenez un résumé clair et concis.",
      category: 'IA',
      webhookPath: 'resume-ia',
      isPublic: true,
      userId: systemUser.id,
      definition: {
        inputs: [
          {
            name: 'text',
            label: 'Texte à résumer',
            type: 'textarea',
            placeholder: 'Collez votre texte ici...',
            required: true,
          },
        ],
      },
    },
  });

  await prisma.workflow.upsert({
    where: { id: 'wf-email-generator' },
    update: {},
    create: {
      id: 'wf-email-generator',
      name: "Générateur d'Email Professionnel",
      description:
        "Générez un email professionnel complet à partir d'un sujet et d'un ton. Mistral AI rédige l'email avec objet, salutation et formule de politesse.",
      category: 'Communication',
      webhookPath: 'email-generator',
      isPublic: true,
      userId: systemUser.id,
      definition: {
        inputs: [
          {
            name: 'subject',
            label: "Sujet de l'email",
            type: 'text',
            placeholder: 'Ex: Demande de réunion pour le projet X',
            required: true,
          },
          {
            name: 'tone',
            label: 'Ton',
            type: 'select',
            options: ['formel', 'amical', 'urgent'],
            required: true,
          },
        ],
      },
    },
  });

  console.log("Seed terminé : 2 workflows publics créés");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
