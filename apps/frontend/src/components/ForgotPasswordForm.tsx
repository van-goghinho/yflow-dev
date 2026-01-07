import React, { useState } from 'react';

interface ForgotPasswordFormProps {
    onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError("Veuillez rentrer une adresse mail valide");
            return;
        }

        console.log('Reset password request', { email });
        // TODO: Connect to backend
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
                <h2 className="auth-title" style={{ fontSize: '1.5rem' }}>Réinitialisation</h2>
                <p className="auth-subtitle">
                    Entrez votre email pour recevoir les instructions
                </p>
            </div>

            <div className="form-group">
                <label className="form-label">Adresse Email</label>
                <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                    }}
                    placeholder="nom@entreprise.com"
                    required
                    autoFocus
                />
                {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</div>}
            </div>

            <button type="submit" className="btn-primary" style={{ marginBottom: '1rem' }}>
                Envoyer le lien
            </button>

            <div style={{ textAlign: 'center' }}>
                <span
                    className="auth-link clickable"
                    onClick={onBack}
                    style={{ cursor: 'pointer', marginLeft: 0 }}
                >
                    Retour à la connexion
                </span>
            </div>
        </form>
    );
};
