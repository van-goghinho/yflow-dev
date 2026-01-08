import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
    onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Identifiants incorrects');
                throw new Error('Erreur de connexion');
            }

            const data = await response.json();
            // Login in context + Redirect (handled in context)
            login(data.access_token, data.user);
            showToast("Connexion réussie", "success");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Une erreur est survenue");
            showToast(err.message || "Erreur de connexion", "error");
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
