import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: 'var(--color-bg-deep)'
        }}>
            <h1 style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Oups !</h2>
            <p style={{ color: '#aab0bd', marginBottom: '2rem' }}>
                La page que vous recherchez semble avoir disparu dans le néant.
            </p>
            <Link to="/app" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', display: 'inline-block' }}>
                Retour à l'accueil
            </Link>
        </div>
    );
};
