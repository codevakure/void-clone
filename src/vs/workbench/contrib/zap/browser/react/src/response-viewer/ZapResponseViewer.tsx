import React, { useState } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';
import { ZapResponseWrapper } from './ZapResponseWrapper.js';

export const ZapResponseViewer: React.FC = () => {
  const { state, dispatch } = useZapPlayground();

  const toggleMinimize = () => {
    dispatch({
      type: 'SET_RESPONSE_UI',
      payload: !state.responsePanelMinimized,
    });
  };

  const getResponsePanelStyle = () => {
    if (state.responsePanelMinimized) {
      return {
        height: '40px',
        minHeight: '40px',
        backgroundColor: 'var(--vscode-panel-background)',
        borderTop: '1px solid var(--vscode-panel-border)',
        display: 'flex',
        flexDirection: 'column' as const,
      };
    } else {
      return {
        flex: 1,
        backgroundColor: 'var(--vscode-panel-background)',
        borderTop: '1px solid var(--vscode-panel-border)',
        display: 'flex',
        flexDirection: 'column' as const,
        minHeight: '200px',
      };
    }
  };

  return (
    <div style={getResponsePanelStyle()}>
      {/* Response Header with Toggle */}
      <div
        style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'var(--vscode-panel-background)',
          borderBottom: state.responsePanelMinimized
            ? 'none'
            : '1px solid var(--vscode-panel-border)',
          color: 'var(--vscode-foreground)',
          fontSize: '13px',
          fontWeight: 'bold',
        }}
      >
        <span>Response</span>

        {/* Only show toggle button in horizontal split view */}
        {state.splitView === 'H' && (
          <button
            onClick={toggleMinimize}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--vscode-foreground)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px',
              borderRadius: '3px',
              transform: state.responsePanelMinimized ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--vscode-toolbar-hoverBackground)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ▼
          </button>
        )}
      </div>

      {/* Response Content */}
      {!state.responsePanelMinimized && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {state.responseUI ? (
            <ZapResponseWrapper />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--vscode-descriptionForeground)',
                fontSize: '14px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ marginBottom: '8px', fontSize: '16px' }}>📡</div>
                <div>Enter the URL and click Send to get a response.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
