import React, { useState } from 'react';

export const SignupForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

        console.log('Signup attempt', { name, email, password });
    };

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
                    placeholder="Créez un mot de passe sécurisé"
                    required
                />
            </div>

            <button type="submit" className="btn-primary">
                Créer un compte
            </button>
        </form>
    );
};
