import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Rendez-vous dans la galerie pour lancer un nouveau workflow.
            </p>
            <Link
                to="/app/gallery"
                className="btn-primary"
                style={{ display: 'inline-block', padding: '0.7rem 1.5rem', textDecoration: 'none' }}
            >
                Ouvrir la galerie
            </Link>
        </div>
    );
};
