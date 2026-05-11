import React from 'react';

export const Features: React.FC = () => {
    const customFeatures = [
        {
            title: "IA Générative",
            desc: "Générez des contenus complexes et analysez des données avec la puissance de Mistral AI intégrée.",
            icon: "🧠"
        },
        {
            title: "100% No-Code",
            desc: "Connectez vos applications favorites sans écrire une seule ligne de code. Interface intuitive.",
            icon: "⚡"
        },
        {
            title: "Infrastructure Robuste",
            desc: "Basé sur les standards n8n, garantissant fiabilité, sécurité et scalabilité pour vos processus.",
            icon: "🛡️"
        }
    ];

    return (
        <section id="features" style={{ background: '#13161c', padding: '100px 2rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '4rem',
                }}>
                    Pourquoi choisir <span style={{ color: 'var(--color-primary)' }}>Y'Flow</span> ?
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {customFeatures.map((f, i) => (
                        <div key={i} style={{
                            padding: '2rem',
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '20px',
                            transition: 'transform 0.3s',
                            cursor: 'default'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{f.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>{f.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
