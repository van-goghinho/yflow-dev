import React, { useState } from 'react';

import { useToast } from '../../context/ToastContext';

export const ProfileSettings: React.FC = () => {
    const [name, setName] = useState('Utilisateur Demo');
    const [email, setEmail] = useState('demo@yflow.com');
    const { showToast } = useToast();

    const handleSave = () => {
        // Mock save
        console.log('Saved profile:', { name, email });
        showToast('Profil mis à jour avec succès', 'success');
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Mon Profil</h3>

            {/* Avatar Placeholder */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginRight: '1.5rem'
                }}>
                    U
                </div>
                <button
                    className="btn-primary"
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-main)'
                    }}
                >
                    Changer l'avatar
                </button>
            </div>

            <div className="form-group" style={{ maxWidth: '500px' }}>
                <label className="form-label">Nom complet</label>
                <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group" style={{ maxWidth: '500px' }}>
                <label className="form-label">Adresse Email</label>
                <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ marginTop: '1rem' }}>
                Enregistrer les changements
            </button>
        </div>
    );
};
