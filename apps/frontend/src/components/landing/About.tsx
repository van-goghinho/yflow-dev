import React from 'react';

// ============================================
// 📝 TEXTES MODIFIABLES - Éditez ici !
// ============================================

const ABOUT_CONTENT = {
    // En-tête de section
    title: "À Propos du Projet",
    subtitle: "Un projet d'étude explorant l'automatisation intelligente et le No-Code",

    // Cartes principales
    genesis: {
        icon: "🚀",
        title: "Genèse du Projet",
        content: "Y'Flow est né d'une volonté de démocratiser l'automatisation de workflows en combinant la puissance de l'IA générative (Mistral AI) avec la flexibilité du No-Code (n8n). L'objectif : rendre l'automatisation accessible aux profils non-techniques."
    },
    concept: {
        icon: "💡",
        title: "Le Concept",
        content: "Créer une couche d'abstraction UX/UI au-dessus de n8n pour simplifier la création de workflows intelligents. Les utilisateurs peuvent glisser-déposer des nœuds, configurer des actions, et laisser l'IA générer du contenu ou analyser des données."
    },
    team: {
        icon: "👥",
        title: "L'Équipe",
        content: "Projet développé par Ilian, Chef de Projet et Lead Engineer, avec l'assistance d'Antigravity AI pour l'architecture technique et le développement fullstack."
    },

    // Stack technique
    stackTitle: "Stack Technique",
    stack: {
        frontend: {
            category: "Frontend",
            technologies: ['React 18', 'TypeScript', 'Vite', 'React Router', 'ReactFlow']
        },
        backend: {
            category: "Backend",
            technologies: ['NestJS', 'Prisma ORM', 'PostgreSQL', 'JWT Auth']
        },
        core: {
            category: "Moteurs Core",
            technologies: ['n8n Community', 'Mistral AI API', 'Docker', 'Podman']
        },
        devops: {
            category: "DevOps",
            technologies: ['Monorepo', 'Docker Compose', 'VPS Debian', 'Git']
        }
    },

    // Architecture
    architectureTitle: "Architecture",
    architectureDescription: "Monorepo TypeScript avec partage de types entre frontend et backend. Déploiement via Podman dans un Pod unique regroupant tous les services. Communication avec n8n exclusivement via API REST pour une isolation complète.",
    architectureDiagram: "[Diagramme d'Architecture]",
    architectureFlow: "Frontend ↔ Backend API ↔ PostgreSQL\nBackend API ↔ n8n API ↔ Mistral AI"
};

// ============================================
// 🎨 COMPOSANT (Ne pas modifier sauf si nécessaire)
// ============================================

export const About: React.FC = () => {
    return (
        <section style={{
            padding: '100px 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, white, #aab0bd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {ABOUT_CONTENT.title}
                </h2>
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '1.1rem',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>
                    {ABOUT_CONTENT.subtitle}
                </p>
            </div>

            {/* Grid Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                <AboutCard {...ABOUT_CONTENT.genesis} />
                <AboutCard {...ABOUT_CONTENT.concept} />
                <AboutCard {...ABOUT_CONTENT.team} />
            </div>

            {/* Stack Technique */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '2rem'
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                }}>
                    {ABOUT_CONTENT.stackTitle}
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem'
                }}>
                    <TechStack {...ABOUT_CONTENT.stack.frontend} />
                    <TechStack {...ABOUT_CONTENT.stack.backend} />
                    <TechStack {...ABOUT_CONTENT.stack.core} />
                    <TechStack {...ABOUT_CONTENT.stack.devops} />
                </div>
            </div>

            {/* Architecture */}
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                }}>
                    {ABOUT_CONTENT.architectureTitle}
                </h3>
                <p style={{
                    color: 'var(--color-text-muted)',
                    maxWidth: '800px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6
                }}>
                    {ABOUT_CONTENT.architectureDescription}
                </p>

                {/* Architecture Diagram Placeholder */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '3rem',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}>
                    {ABOUT_CONTENT.architectureDiagram}
                    <div style={{ fontSize: '0.9rem', marginTop: '1rem', fontWeight: 'normal', whiteSpace: 'pre-line' }}>
                        {ABOUT_CONTENT.architectureFlow}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Helper Components
const AboutCard: React.FC<{ icon: string; title: string; content: string }> = ({ icon, title, content }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '2rem',
        transition: 'transform 0.2s, border-color 0.2s'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = 'rgba(124, 77, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
        }}
    >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{title}</h4>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {content}
        </p>
    </div>
);

const TechStack: React.FC<{ category: string; technologies: string[] }> = ({ category, technologies }) => (
    <div>
        <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '0.8rem',
            color: 'var(--color-primary)'
        }}>
            {category}
        </h4>
        <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
        }}>
            {technologies.map((tech, index) => (
                <li key={index} style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    paddingLeft: '1.2rem',
                    position: 'relative'
                }}>
                    <span style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--color-primary)'
                    }}>▸</span>
                    {tech}
                </li>
            ))}
        </ul>
    </div>
);
