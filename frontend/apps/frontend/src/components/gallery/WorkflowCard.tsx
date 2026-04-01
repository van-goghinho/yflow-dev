import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    IA:            { bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)', text: '#a78bfa' },
    Communication: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', text: '#93c5fd' },
    Productivité:  { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7' },
};

const CATEGORY_ICONS: Record<string, string> = {
    IA: '🤖',
    Communication: '✉️',
    Productivité: '⚡',
};

interface WorkflowCardProps {
    workflow: {
        id: string;
        name: string;
        description?: string;
        category?: string;
        createdAt: string;
    };
    onUse: (id: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
    const category = workflow.category ?? 'IA';
    const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['IA'];
    const icon = CATEGORY_ICONS[category] ?? '⚙️';

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'border-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'white' }}>{workflow.name}</h3>
                </div>
                <span style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}>
                    {category}
                </span>
            </div>

            {workflow.description && (
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                    margin: 0,
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                } as React.CSSProperties}>
                    {workflow.description}
                </p>
            )}

            <Link
                to={`/app/workflows/${workflow.id}/run`}
                className="btn-primary"
                style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                }}
            >
                Utiliser
            </Link>
        </div>
    );
};
