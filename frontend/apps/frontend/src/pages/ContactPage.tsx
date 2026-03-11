import React from 'react';
import { Footer } from '../components/Footer';

export const ContactPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Contactez-nous</h1>
                <p style={{ fontSize: '1.1rem', color: '#aab0bd', marginBottom: '3rem' }}>
                    Vous avez une question sur nos offres ou besoin d'une démo personnalisée ?<br />
                    Notre équipe est disponible pour vous accompagner.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                    {/* Support Card */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '2rem' }}>✉️</div>
                        <h3 style={{ fontSize: '1.2rem' }}>Support & Commerce</h3>
                        <p style={{ color: '#aab0bd' }}>
                            Pour tout renseignement général ou demande de devis :
                        </p>
                        <a
                            href="mailto:contact@yflow.com"
                            style={{
                                fontSize: '1.2rem',
                                color: 'var(--color-secondary)',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}
                        >
                            contact@yflow.com
                        </a>
                    </div>

                    {/* Tech Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '2rem' }}>🛠️</div>
                        <h3 style={{ fontSize: '1.2rem' }}>Support Technique</h3>
                        <p style={{ color: '#aab0bd' }}>
                            Un problème avec vos workflows ? Contactez notre équipe technique :
                        </p>
                        <a
                            href="mailto:support@yflow.com"
                            style={{
                                fontSize: '1.2rem',
                                color: 'white',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}
                        >
                            support@yflow.com
                        </a>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};
