import React, { useState, useEffect } from 'react';
import { WelcomeState } from '../components/dashboard/WelcomeState';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
    const [workflowCount, setWorkflowCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const workflows = await api.getWorkflows();
                setWorkflowCount(Array.isArray(workflows) ? workflows.length : 0);
            } catch (err) {
                console.error('Failed to fetch workflows', err);
                setWorkflowCount(0);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (!isLoading && workflowCount === 0) {
        return <WelcomeState />;
    }

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Tableau de bord</h2>
            {user && (
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                    Bienvenue, <strong style={{ color: 'white' }}>{user.name}</strong> 👋
                </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Workflows"
                    value={isLoading ? '...' : String(workflowCount ?? 0)}
                    icon="⚡"
                />
                <StatCard title="Exécutions (24h)" value="—" icon="🔄" />
                <StatCard title="Taux de succès" value="—" icon="✅" />
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon?: string }> = ({ title, value, icon }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
    }}>
        {icon && <div style={{ fontSize: '1.5rem' }}>{icon}</div>}
        <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{title}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
        </div>
    </div>
);
