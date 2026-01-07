import React from 'react';
import { Footer } from '../components/Footer';

export const ContactPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Contactez-nous</h1>
                <p style={{ fontSize: '1.1rem', color: '#aab0bd', marginBottom: '3rem' }}>
                    Une question ? Un projet ? Notre équipe est là pour vous répondre.
                </p>

                <div style={{
                    background: 'var(--glass-bg)',
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--color-border)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Support Client</h3>
                    <p style={{ marginBottom: '1.5rem', color: '#aab0bd' }}>
                        Pour toute demande technique ou commerciale, écrivez-nous à :
                    </p>
                    <a
                        href="mailto:contact@yflow.com"
                        style={{
                            fontSize: '1.5rem',
                            color: 'var(--color-secondary)',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }}
                    >
                        contact@yflow.com
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
};
