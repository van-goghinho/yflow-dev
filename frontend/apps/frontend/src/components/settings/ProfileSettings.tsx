import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const ProfileSettings: React.FC = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        // Prefill from JWT context first, then fetch from API for freshest data
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
        api.getMe().then((data: any) => {
            setName(data.name || '');
            setEmail(data.email || '');
        }).catch(console.error);
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.updateProfile({ name, email });
            showToast('Profil mis à jour avec succès', 'success');
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la mise à jour', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const initials = name?.charAt(0).toUpperCase() || 'U';

    return (
        <form onSubmit={handleSave} style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Mon Profil</h3>

            {/* Avatar */}
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
                    {initials}
                </div>
            </div>

            <div className="form-group" style={{ maxWidth: '500px' }}>
                <label className="form-label">Nom complet</label>
                <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <div className="form-group" style={{ maxWidth: '500px' }}>
                <label className="form-label">Adresse Email</label>
                <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: '1rem', opacity: isLoading ? 0.6 : 1 }}
                disabled={isLoading}
            >
                {isLoading ? 'Enregistrement...' : 'Enregistrer les changements'}
            </button>
        </form>
    );
};
