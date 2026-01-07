import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        // TODO: Clear session
        navigate('/auth');
    };

    const closeSidebar = () => {
        if (isMobile) setIsSidebarOpen(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', color: 'var(--color-text-main)' }}>
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 49
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#1b212d',
                borderRight: '1px solid var(--color-border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'fixed' : 'relative',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 50,
                transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
                transition: 'transform 0.3s ease-in-out'
            }}>
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, white, var(--color-primary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Y'Flow
                    </h1>
                    {isMobile && (
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem' }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link to="/app" className="nav-item" style={navItemStyle} onClick={closeSidebar}>
                        📊 Tableau de bord
                    </Link>
                    <Link to="/app/workflows" className="nav-item" style={navItemStyle} onClick={closeSidebar}>
                        ⚡ Workflows
                    </Link>
                    <Link to="/app/settings" className="nav-item" style={navItemStyle} onClick={closeSidebar}>
                        ⚙️ Paramètres
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        ...navItemStyle,
                        marginTop: 'auto',
                        background: 'transparent',
                        textAlign: 'left',
                        color: '#ff6b6b'
                    }}
                >
                    🚪 Déconnexion
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : 'auto' }}>
                {/* Header */}
                <header style={{
                    height: '70px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'space-between' : 'flex-end',
                    padding: '0 2rem',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(27, 33, 45, 0.5)'
                }}>
                    {isMobile && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ☰
                        </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {!isMobile && (
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Utilisateur Demo
                            </span>
                        )}
                        <div style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            U
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </div>
    );
};

const navItemStyle: React.CSSProperties = {
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    transition: 'all 0.2s',
    display: 'block',
    cursor: 'pointer',
    fontSize: '0.95rem'
};
