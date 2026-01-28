import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Auth.css';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export const AuthPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialView = searchParams.get('view') === 'signup' ? 'SIGNUP' : 'LOGIN';
    const [view, setView] = useState<AuthView>(initialView);

    const renderContent = () => {
        switch (view) {
            case 'LOGIN':
                return (
                    <>
                        <div className="auth-header">
                            <h1 className="auth-title">Y'Flow</h1>
                            <p className="auth-subtitle">Ravi de vous revoir sur votre espace</p>
                        </div>
                        <LoginForm onForgotPassword={() => setView('FORGOT_PASSWORD')} />
                        <div className="auth-footer">
                            Pas encore de compte ?
                            <span
                                className="auth-link clickable"
                                onClick={() => setView('SIGNUP')}
                                style={{ cursor: 'pointer' }}
                            >
                                Inscription
                            </span>
                        </div>
                    </>
                );
            case 'SIGNUP':
                return (
                    <>
                        <div className="auth-header">
                            <h1 className="auth-title">Y'Flow</h1>
                            <p className="auth-subtitle">Commencez à automatiser vos tâches dès aujourd'hui</p>
                        </div>
                        <SignupForm />
                        <div className="auth-footer">
                            Déjà un compte ?
                            <span
                                className="auth-link clickable"
                                onClick={() => setView('LOGIN')}
                                style={{ cursor: 'pointer' }}
                            >
                                Connexion
                            </span>
                        </div>
                    </>
                );
            case 'FORGOT_PASSWORD':
                return <ForgotPasswordForm onBack={() => setView('LOGIN')} />;
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {renderContent()}
            </div>
        </div>
    );
};
