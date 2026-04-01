import React from 'react';

interface WorkflowResultProps {
  loading: boolean;
  error: string | null;
  result: string | null;
  onRetry: () => void;
}

export const WorkflowResult: React.FC<WorkflowResultProps> = ({ loading, error, result, onRetry }) => {
  if (loading) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>L'IA travaille sur votre demande...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
      }}>
        <p style={{ color: '#f87171', margin: '0 0 1rem 0', fontWeight: 500 }}>Une erreur est survenue</p>
        <p style={{ color: '#fca5a5', margin: '0 0 1rem 0', fontSize: '0.9rem' }}>{error}</p>
        <button
          onClick={onRetry}
          style={{
            background: 'transparent',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result).catch(() => {});
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(124,58,237,0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>Résultat</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopy}
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#a78bfa',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Copier
          </button>
          <button
            onClick={onRetry}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--color-text-muted)',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Relancer
          </button>
        </div>
      </div>
      <div style={{
        color: '#e2e8f0',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        fontSize: '0.95rem',
      }}>
        {result}
      </div>
    </div>
  );
};
