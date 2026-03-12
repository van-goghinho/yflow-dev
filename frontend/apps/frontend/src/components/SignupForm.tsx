import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../services/api';

interface PasswordRequirement {
    label: string;
    met: boolean;
}

export const SignupForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(false); // TODO: Re-enable with email verification

    const { showToast } = useToast();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const getPasswordRequirements = (pwd: string): PasswordRequirement[] => {
        return [
            { label: 'Au moins 8 caractères', met: pwd.length >= 8 },
            { label: 'Au moins 1 majuscule', met: /[A-Z]/.test(pwd) },
            { label: 'Au moins 1 minuscule', met: /[a-z]/.test(pwd) },
            { label: 'Au moins 1 chiffre', met: /[0-9]/.test(pwd) },
            { label: 'Au moins 1 caractère spécial (@, #, $, etc.)', met: /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
        ];
    };

    const validatePassword = (pwd: string): { valid: boolean; message?: string } => {
        const requirements = getPasswordRequirements(pwd);
        const unmet = requirements.filter(r => !r.met);

        if (unmet.length > 0) {
            const missing = unmet.map(r => r.label).join(', ');
            return {
                valid: false,
                message: `Mot de passe insuffisant. Il manque : ${missing}`
            };
        }

        return { valid: true };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError("Veuillez rentrer une adresse mail valide");
            showToast("Veuillez rentrer une adresse mail valide", "error");
            return;
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            setError(passwordCheck.message!);
            showToast(passwordCheck.message!, "error");
            return;
        }

        setIsLoading(true);

        try {
            await signup(email, password, name);

            showToast("Compte créé avec succès ! Vous pouvez maintenant vous connecter.", "success");

            // TODO: Uncomment when email verification is configured
            // setIsSuccess(true);

            // Redirect to login
            navigate('/auth');

        } catch (err: any) {
            console.error(err);
            let msg: string;
            if (err instanceof ApiError) {
                if (err.status === 0) msg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
                else if (err.status === 409) msg = 'Un compte avec cet email existe déjà.';
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

    // TODO: Activate when email verification service is configured
    // if (isSuccess) {
    //     return (
    //         <div style={{ textAlign: 'center', padding: '2rem 0' }}>
    //             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
    //             <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>Vérifiez vos emails</h3>
    //             <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
    //                 Un lien de confirmation a été envoyé à <strong>{email}</strong>.<br />
    //                 Veuillez cliquer dessus pour activer votre compte.
    //             </p>
    //             <button
    //                 onClick={() => window.location.reload()}
    //                 className="btn-primary"
    //                 style={{ background: 'transparent', border: '1px solid var(--color-border)' }}
    //             >
    //                 Retour à la connexion
    //             </button>
    //         </div>
    //     );
    // }

    const requirements = getPasswordRequirements(password);
    const showRequirements = password.length > 0;

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    disabled={isLoading}
                />
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
                    disabled={isLoading}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="Créez un mot de passe sécurisé"
                        required
                        disabled={isLoading}
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
                        disabled={isLoading}
                    >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                </div>

                {showRequirements && (
                    <div style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>
                        {requirements.map((req, index) => (
                            <div
                                key={index}
                                style={{
                                    color: req.met ? '#4ade80' : '#94a3b8',
                                    marginBottom: '0.3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>{req.met ? '✓' : '○'}</span>
                                <span>{req.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && <div style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</div>}

            <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
                {isLoading ? 'Création en cours...' : 'Créer un compte'}
            </button>
        </form>
    );
};
