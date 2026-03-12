import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';

interface LoginFormProps {
    onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();
    const { login } = useAuth();

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError("Veuillez rentrer une adresse mail valide");
            showToast("Veuillez rentrer une adresse mail valide", "error");
            return;
        }

        try {
            setIsLoading(true);
            await login(email, password, rememberMe);
            showToast("Connexion réussie", "success");

        } catch (err: any) {
            console.error(err);
            let msg: string;
            if (err instanceof ApiError) {
                if (err.status === 0) msg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
                else if (err.status === 401) msg = 'Identifiants incorrects. Vérifiez votre email et mot de passe.';
                else msg = 'Une erreur est survenue. Veuillez réessayer.';
            } else {
                msg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
            }
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
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
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '0.8rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            opacity: 0.6,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Rester connecté
                </label>
                <span
                    className="clickable"
                    onClick={onForgotPassword}
                    style={{ cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}
                >
                    Mot de passe oublié ?
                </span>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.6 : 1 }}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>
    );
};
