import React, { useState } from 'react';
import { WelcomeState } from '../components/dashboard/WelcomeState';

export const DashboardPage: React.FC = () => {
    // Mock state: set to false to show onboarding, true to show stats
    const [hasWorkflows, setHasWorkflows] = useState(false);

    if (!hasWorkflows) {
        return <WelcomeState />;
    }

    return (
        <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Tableau de bord</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Workflows Actifs" value="0" />
                <StatCard title="Exécutions (24h)" value="0" />
                <StatCard title="Taux de succès" value="-" />
            </div>

            {/* Dev Helper */}
            <button
                onClick={() => setHasWorkflows(false)}
                style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
                (Dev: Switch to Empty State)
            </button>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.5rem'
    }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
    </div>
);
