import React, { useState } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';
import { ZapQueryParamsTable } from './ZapQueryParamsTable.js';
import { ZapAuthHeaders } from './ZapAuthHeaders.js';
import { ZapRequestHeadersTable } from './ZapRequestHeadersTable.js';
import { ZapRequestBody } from './ZapRequestBody.js';

type PayloadTabType = 'params' | 'auth' | 'headers' | 'body';

export const ZapPayloadForm: React.FC = () => {
  const { state } = useZapPlayground();
  const [activeTab, setActiveTab] = useState<PayloadTabType>(
    state.formData.payload ? 'body' : 'params'
  );

  const getTabStyle = (tabType: PayloadTabType, isActive: boolean) => ({
    padding: '8px 16px',
    border: 'none',
    backgroundColor: isActive
      ? 'var(--vscode-tab-activeBackground)'
      : 'var(--vscode-tab-inactiveBackground)',
    color: isActive
      ? 'var(--vscode-tab-activeForeground)'
      : 'var(--vscode-tab-inactiveForeground)',
    cursor: 'pointer',
    fontSize: '13px',
    borderBottom: isActive
      ? '2px solid var(--vscode-tab-activeBorder)'
      : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--vscode-font-family)',
    transition: 'all 0.2s ease'
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'params':
        return <ZapQueryParamsTable />;
      case 'auth':
        return <ZapAuthHeaders />;
      case 'headers':
        return <ZapRequestHeadersTable />;
      case 'body':
        return <ZapRequestBody />;
      default:
        return null;
    }
  };

  const getTabCount = (tabType: PayloadTabType): number => {
    switch (tabType) {
      case 'params':
        // Count URL params
        try {
          const url = new URL(state.formData.url || 'http://example.com');
          return url.searchParams.size;
        } catch {
          return 0;
        }
      case 'auth':
        return state.auth ? 1 : 0;
      case 'headers':
        return state.requestHeaders.filter(h => h.enabled && h.key.trim()).length;
      case 'body':
        return state.formData.payload ? 1 : 0;
      default:
        return 0;
    }
  };

  const TabButton = ({ type, label }: { type: PayloadTabType; label: string }) => {
    const isActive = activeTab === type;
    const count = getTabCount(type);

    return (
      <button
        onClick={() => setActiveTab(type)}
        style={getTabStyle(type, isActive)}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--vscode-tab-hoverBackground)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--vscode-tab-inactiveBackground)';
          }
        }}
      >
        <span>{label}</span>
        {count > 0 && (
          <span
            style={{
              backgroundColor: 'var(--vscode-badge-background)',
              color: 'var(--vscode-badge-foreground)',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: 600,
              minWidth: '16px',
              textAlign: 'center'
            }}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className="zap-payload-form"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--vscode-editor-background)',
        overflow: 'hidden'
      }}
    >
      {/* Tab headers */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--vscode-tab-border)',
          backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground)',
          overflow: 'hidden'
        }}
      >
        <TabButton type="params" label="Params" />
        <TabButton type="auth" label="Auth" />
        <TabButton type="headers" label="Headers" />
        <TabButton type="body" label="Body" />
      </div>

      {/* Tab content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'var(--vscode-editor-background)'
        }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
};
