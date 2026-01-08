import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Bot, Zap, Globe, Mail } from 'lucide-react';

const icons = {
    trigger: Zap,
    mistral: Bot,
    http: Globe,
    email: Mail,
};

const colors = {
    trigger: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
    action: 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)',
    ai: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
};

const CustomNode = ({ data }: NodeProps) => {
    const Icon = icons[data.icon as keyof typeof icons] || Zap;
    const isTrigger = data.type === 'trigger';

    return (
        <div style={{
            padding: '10px 15px',
            borderRadius: '12px',
            background: 'rgba(30, 39, 46, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            color: 'white',
            minWidth: '180px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {!isTrigger && (
                <Handle type="target" position={Position.Left} style={{ background: '#fff' }} />
            )}

            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isTrigger ? colors.trigger : (data.category === 'ai' ? colors.ai : colors.action),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
            }}>
                <Icon size={18} color="white" />
            </div>

            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{data.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{data.subtext}</div>
            </div>

            <Handle type="source" position={Position.Right} style={{ background: '#fff' }} />
        </div>
    );
};

export default memo(CustomNode);
