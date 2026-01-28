import React, { type DragEvent } from 'react';
import { Bot, Zap, Globe, Mail } from 'lucide-react';

export const Sidebar: React.FC = () => {
    const onDragStart = (event: DragEvent, nodeType: string, payload: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/payload', JSON.stringify(payload));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside style={{
            width: '250px',
            borderRight: '1px solid var(--color-border)',
            padding: '1rem',
            background: 'var(--bg-surface)'
        }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                Boîte à outils
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Déclencheurs</div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'custom', { type: 'trigger', label: 'Webhook', icon: 'trigger', subtext: 'Reçoit des données JSON' })} draggable>
                    <SidebarItem icon={Zap} label="Webhook Web" color="#ff6b6b" />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Actions IA</div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'custom', { type: 'action', category: 'ai', label: 'Mistral AI', icon: 'mistral', subtext: 'Génération de texte' })} draggable>
                    <SidebarItem icon={Bot} label="Mistral AI" color="#a29bfe" />
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Outils</div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'custom', { type: 'action', label: 'Requête HTTP', icon: 'http', subtext: 'GET/POST externe' })} draggable>
                    <SidebarItem icon={Globe} label="Requête HTTP" color="#686de0" />
                </div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'custom', { type: 'action', label: 'Envoyer Email', icon: 'email', subtext: 'Via SMTP' })} draggable>
                    <SidebarItem icon={Mail} label="Envoyer Email" color="#686de0" />
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.8rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        cursor: 'grab',
        border: '1px solid transparent',
        transition: 'all 0.2s'
    }}
        className="sidebar-item"
    >
        <Icon size={18} color={color} />
        <span style={{ fontSize: '0.9rem' }}>{label}</span>
    </div>
);
