import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '4rem 2rem',
            marginTop: 'auto',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '3rem'
            }}>
                {/* Column 1: Brand */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', color: 'inherit' }}>
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
                    </Link>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        L'automatisation sans limites.<br />
                        Simplifiez vos workflows dès aujourd'hui.
                    </p>

                    {/* Social Placeholders */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['𝕏', 'in', 'Gh', 'Yt'].map((icon, i) => (
                            <div key={i} style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#aab0bd',
                                fontSize: '0.9rem',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Produit */}
                <div style={columnStyle}>
                    <h4 style={headingStyle}>Produit</h4>
                    <Link to="/app/workflows" style={linkStyle}>Workflows</Link>
                    <Link to="#" style={linkStyle}>Intégrations</Link>
                    <Link to="#" style={linkStyle}>Tarifs</Link>
                    <Link to="#" style={linkStyle}>Changelog</Link>
                </div>

                {/* Column 3: Ressources */}
                <div style={columnStyle}>
                    <h4 style={headingStyle}>Ressources</h4>
                    <Link to="#" style={linkStyle}>Documentation</Link>
                    <Link to="#" style={linkStyle}>Tutoriels</Link>
                    <Link to="#" style={linkStyle}>Communauté</Link>
                    <Link to="#" style={linkStyle}>Blog</Link>
                </div>

                {/* Column 4: Légal & Contact */}
                <div style={columnStyle}>
                    <h4 style={headingStyle}>Entreprise</h4>
                    <Link to="/contact" style={linkStyle}>Contact</Link>
                    <Link to="/legal" style={linkStyle}>Mentions Légales</Link>
                    <Link to="/cgu" style={linkStyle}>CGU</Link>
                    <Link to="#" style={linkStyle}>Confidentialité</Link>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '3rem auto 0',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem'
            }}>
                &copy; {new Date().getFullYear()} Y'Flow. Tous droits réservés.
            </div>
        </footer>
    );
};

const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
};

const headingStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-text-main)'
};

const linkStyle: React.CSSProperties = {
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    cursor: 'pointer'
};
