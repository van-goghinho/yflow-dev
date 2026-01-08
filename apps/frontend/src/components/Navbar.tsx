import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            background: 'rgba(27, 33, 45, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            {/* Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '1.2rem'
                }}>
                    Y
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Y'Flow</span>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="#" style={linkStyle}>Fonctionnalités</Link>
                <Link to="#" style={linkStyle}>Tarifs</Link>
                <Link to="/auth" style={linkStyle}>Connexion</Link>
                <button
                    onClick={() => navigate('/auth?view=signup')}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                >
                    S'inscrire
                </button>
            </div>
        </nav>
    );
};

const linkStyle: React.CSSProperties = {
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    fontWeight: 500
};
