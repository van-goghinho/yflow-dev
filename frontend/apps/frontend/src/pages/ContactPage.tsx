import React, { useState } from 'react';
import { Footer } from '../components/Footer';

export const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

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

                {/* Formulaire de contact */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '2rem',
                }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>Envoyer un message</h2>

                    {sent ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#6ee7b7',
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅</div>
                            <p style={{ margin: 0, fontWeight: 500 }}>Message envoyé !</p>
                            <p style={{ color: '#aab0bd', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                Nous reviendrons vers vous dès que possible.
                            </p>
                            <button
                                onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}
                                style={{
                                    marginTop: '1rem',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--color-text-muted)',
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                }}
                            >
                                Nouveau message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Nom</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Votre message..."
                                    required
                                    rows={5}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        color: 'white',
                                        fontSize: '0.95rem',
                                        resize: 'vertical',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                                Envoyer
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};
