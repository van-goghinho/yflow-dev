import React from 'react';
import { WorkflowCard } from './WorkflowCard';
import { useNavigate } from 'react-router-dom';

interface WorkflowGridProps {
    workflows: any[];
}

export const WorkflowGrid: React.FC<WorkflowGridProps> = ({ workflows }) => {
    const navigate = useNavigate();

    const handleUse = (id: string) => {
        // Rediriger vers l'éditeur de workflow, optional on peut passer l'id
        console.log(`Using workflow ${id}`);
        navigate(`/app/workflows`); // Or specific workflow page if it exists
    };

    if (workflows.length === 0) {
        return <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>Aucun workflow trouvé.</div>;
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
        }}>
            {workflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} onUse={handleUse} />
            ))}
        </div>
    );
};
