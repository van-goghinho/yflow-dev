import React from 'react';
import { WorkflowCard } from './WorkflowCard';

interface WorkflowGridProps {
    workflows: any[];
}

export const WorkflowGrid: React.FC<WorkflowGridProps> = ({ workflows }) => {
    if (workflows.length === 0) {
        return (
            <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
                Aucun workflow disponible pour le moment.
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem',
        }}>
            {workflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} onUse={() => {}} />
            ))}
        </div>
    );
};
