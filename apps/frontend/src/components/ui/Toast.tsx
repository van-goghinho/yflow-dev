import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000); // Auto dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return 'rgba(39, 201, 63, 0.9)';
            case 'error': return 'rgba(255, 95, 86, 0.9)';
            case 'info': return 'rgba(66, 133, 244, 0.9)';
            default: return 'rgba(30, 30, 30, 0.9)';
        }
    };

    return (
        <div style={{
            background: getBackgroundColor(),
            color: 'white',
            padding: '0.8rem 1.2rem',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <span style={{ fontSize: '0.95rem' }}>{message}</span>
            <button
                onClick={() => onClose(id)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                    opacity: 0.8
                }}
            >
                ×
            </button>
            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};
