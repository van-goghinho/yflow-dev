import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface LoginFormProps {
    onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { showToast } = useToast();

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError("Veuillez rentrer une adresse mail valide");
            showToast("Veuillez rentrer une adresse mail valide", "error");
            return;
        }

        console.log('Login attempt', { email, password });
        showToast("Connexion réussie", "success");
    };

    return (
        <form onSubmit={handleSubmit}>
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
                />
                {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</div>}
            </div>

            <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />
            </div>

            <div className="forgot-password">
                <span
                    className="clickable"
                    onClick={onForgotPassword}
                    style={{ cursor: 'pointer', color: 'inherit' }}
                >
                    Mot de passe oublié ?
                </span>
            </div>

            <button type="submit" className="btn-primary">
                Se connecter
            </button>
        </form>
    );
};
