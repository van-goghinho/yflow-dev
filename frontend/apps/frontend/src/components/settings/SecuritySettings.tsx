import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const SecuritySettings: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast('Les nouveaux mots de passe ne correspondent pas', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showToast('Le nouveau mot de passe doit contenir au moins 8 caractères', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await api.updatePassword(currentPassword, newPassword);
            showToast('Mot de passe mis à jour avec succès', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            showToast(err.message || 'Erreur lors de la mise à jour du mot de passe', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Sécurité</h3>

            <form onSubmit={handleSave} style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Changer le mot de passe</h4>

                <div className="form-group">
                    <label className="form-label">Mot de passe actuel</label>
                    <input
                        type="password"
                        className="form-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ marginTop: '0.5rem', opacity: isLoading ? 0.6 : 1 }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
            </form>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', maxWidth: '500px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Authentification à deux facteurs (2FA)</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>2FA désactivé</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Ajoutez une couche de sécurité supplémentaire.</div>
                    </div>
                    <button className="btn-primary" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>Activer</button>
                </div>
            </div>
        </div>
    );
};
