import React, { useState } from 'react';
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { SecuritySettings } from '../components/settings/SecuritySettings';

type SettingsTab = 'PROFILE' | 'SECURITY';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');

    return (
        <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Paramètres</h2>

            <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 200px)' }}>
                {/* Settings Sidebar */}
                <div style={{
                    width: '200px',
                    borderRight: '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <button
                        onClick={() => setActiveTab('PROFILE')}
                        style={{
                            ...tabStyle,
                            background: activeTab === 'PROFILE' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'PROFILE' ? 'white' : 'var(--color-text-muted)'
                        }}
                    >
                        👤 Mon Profil
                    </button>
                    <button
                        onClick={() => setActiveTab('SECURITY')}
                        style={{
                            ...tabStyle,
                            background: activeTab === 'SECURITY' ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: activeTab === 'SECURITY' ? 'white' : 'var(--color-text-muted)'
                        }}
                    >
                        🔒 Sécurité
                    </button>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {activeTab === 'PROFILE' && <ProfileSettings />}
                    {activeTab === 'SECURITY' && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
};

const tabStyle: React.CSSProperties = {
    padding: '0.8rem 1rem',
    textAlign: 'left',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    fontWeight: 500
};
