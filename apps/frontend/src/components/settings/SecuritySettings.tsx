import React, { useState } from 'react';

import { useToast } from '../../context/ToastContext';

export const SecuritySettings: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showToast } = useToast();

    const handleSave = () => {
        console.log('Update password attempt');
        showToast('Mot de passe mis à jour', 'success');
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 600 }}>Sécurité</h3>

            <div style={{ marginBottom: '2rem', maxWidth: '500px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Changer le mot de passe</h4>

                <div className="form-group">
                    <label className="form-label">Mot de passe actuel</label>
                    <input
                        type="password"
                        className="form-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSave} className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    Mettre à jour
                </button>
            </div>

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
