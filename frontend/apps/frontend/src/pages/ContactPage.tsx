import React from 'react';
import { Footer } from '../components/Footer';

export const ContactPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Contactez-nous</h1>
                <p style={{ fontSize: '1rem', color: '#aab0bd', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Une question sur Y'Flow ? N'hésitez pas à nous écrire.<br />
                    Projet académique — Ynov Campus Aix-en-Provence, B3 Informatique.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>✉️</span>
                        <h3 style={{ fontSize: '1rem', margin: 0, color: 'white' }}>Email</h3>
                        <a
                            href="mailto:yflowprojet@gmail.com"
                            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}
                        >
                            yflowprojet@gmail.com
                        </a>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>🎓</span>
                        <h3 style={{ fontSize: '1rem', margin: 0, color: 'white' }}>Campus</h3>
                        <p style={{ color: '#aab0bd', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Ynov Campus Aix-en-Provence<br />
                            B3 Informatique — 2025/2026
                        </p>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'white' }}>Envoyer un message</h2>
                    <p style={{ color: '#aab0bd', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Pour toute question ou demande, contactez l'équipe directement par email.
                    </p>
                    <a
                        href="mailto:yflowprojet@gmail.com?subject=Contact%20Y'Flow"
                        className="btn-primary"
                        style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                        Écrire un email
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    );
};
