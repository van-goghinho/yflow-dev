import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WelcomeState: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            {/* Icon/Illustration Placeholder */}
            <div style={{
                fontSize: '4rem',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 20px rgba(124, 77, 255, 0.3))'
            }}>
                🚀
            </div>

            <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
            }}>
                Bienvenue sur <span style={{ color: 'var(--color-primary)' }}>Y'Flow</span>, Utilisateur !
            </h2>

            <p style={{
                color: 'var(--color-text-muted)',
                fontSize: '1.1rem',
                maxWidth: '500px',
                marginBottom: '2.5rem',
                lineHeight: 1.6
            }}>
                Vous n'avez pas encore de workflow actif. Lancez votre première automatisation dès maintenant et laissez l'IA faire le travail.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/app/workflows')}
                    className="btn-primary"
                    style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
                >
                    Créer mon premier workflow
                </button>

                <button
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                    }}
                >
                    Consulter la documentation
                </button>
            </div>
        </div>
    );
};
