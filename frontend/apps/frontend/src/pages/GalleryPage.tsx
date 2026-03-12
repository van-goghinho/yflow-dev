import React, { useEffect, useState } from 'react';
import { WorkflowGrid } from '../components/gallery/WorkflowGrid';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const GalleryPage: React.FC = () => {
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const data = await api.getWorkflows();
                // Assuming data is an array of workflows
                setWorkflows(data);
            } catch (err) {
                console.error(err);
                showToast("Erreur lors de la récupération des workflows", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkflows();
    }, [showToast]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'white' }}>Galerie</h1>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                        Découvrez et utilisez les workflows disponibles.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Chargement...</div>
            ) : (
                <WorkflowGrid workflows={workflows} />
            )}
        </div>
    );
};
