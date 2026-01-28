import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section style={{
            padding: '160px 2rem 100px',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glow Effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(124, 77, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
                pointerEvents: 'none',
                zIndex: -1
            }} />

            <h1 style={{
                fontSize: '4rem',
                fontWeight: 800,
                marginBottom: '1.5rem',
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, white, #aab0bd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Automatisez vos workflows<br />
                <span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }}>avec l'IA.</span>
            </h1>

            <p style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-muted)',
                maxWidth: '700px',
                margin: '0 auto 3rem',
                lineHeight: 1.6
            }}>
                Y'Flow combine la puissance de Mistral AI et la flexibilité du No-Code
                pour propulser votre productivité vers de nouveaux sommets.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/auth?view=signup')}
                    className="btn-primary"
                    style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                >
                    Commencer gratuitement
                </button>
                <button
                    style={{
                        padding: '1rem 2.5rem',
                        fontSize: '1.1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                    }}
                >
                    Voir la démo
                </button>
            </div>

            {/* Abstract UI Representation */}
            <div style={{
                marginTop: '5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '1rem'
                }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.1)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: '16px'
                }}>
                    Interface Workflow No-Code
                </div>
            </div>
        </section>
    );
};
