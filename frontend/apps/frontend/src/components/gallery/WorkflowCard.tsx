import React from 'react';

interface WorkflowCardProps {
    workflow: {
        id: string;
        name: string;
        createdAt: string;
        // any other props returned by API
    };
    onUse: (id: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onUse }) => {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
        }}>
            <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: 'white' }}>{workflow.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Créé le : {new Date(workflow.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            <button 
                className="btn-primary" 
                onClick={() => onUse(workflow.id)}
                style={{ marginTop: 'auto' }}
            >
                Utiliser
            </button>
        </div>
    );
};
