import React from 'react';
import { Sidebar } from '../components/workflow/Sidebar';
import { FlowCanvasWithProvider } from '../components/workflow/FlowCanvas';

export const WorkflowEditorPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
            {/* 
          calc(100vh - 70px) assumes Header height is 70px. 
          Ideally we should make dashboard layout flex properly to fill remaining space
          but this is a good quick fix to ensure full height for canvas.
      */}
            <Sidebar />
            <div style={{ flex: 1, position: 'relative' }}>
                <FlowCanvasWithProvider />
            </div>
        </div>
    );
};
