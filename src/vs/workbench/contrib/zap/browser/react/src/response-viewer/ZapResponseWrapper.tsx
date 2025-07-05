import React, { useState } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';
import { ZapResponseBody } from './ZapResponseBody.js';
import { ZapResponseHeaders } from './ZapResponseHeaders.js';

type ResponseTabType = 'body' | 'headers' | 'cookies' | 'timeline';

export const ZapResponseWrapper: React.FC = () => {
  const { state } = useZapPlayground();
  const [activeTab, setActiveTab] = useState<ResponseTabType>('body');

  const response = state.apiResponse;
  const error = state.apiError;

  if (error) {
    return (
      <div style={{
        padding: '20px',
        color: 'var(--vscode-errorForeground)',
        backgroundColor: 'var(--vscode-inputValidation-errorBackground)',
        border: '1px solid var(--vscode-inputValidation-errorBorder)',
        borderRadius: '4px',
        margin: '16px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--vscode-errorForeground)' }}>
          Request Failed
        </h4>
        <pre style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontSize: '13px',
          fontFamily: 'var(--vscode-editor-font-family, monospace)'
        }}>
          {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  if (!response || Object.keys(response).length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--vscode-descriptionForeground)',
        fontSize: '14px',
      }}>
        Loading response...
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return '#10b981'; // green
    if (status >= 300 && status < 400) return '#f59e0b'; // yellow
    if (status >= 400 && status < 500) return '#ef4444'; // red
    if (status >= 500) return '#7c2d12'; // dark red
    return 'var(--vscode-foreground)';
  };

  const getTabStyle = (tabType: ResponseTabType, isActive: boolean) => ({
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
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'body':
        return <ZapResponseBody response={response} />;
      case 'headers':
        return <ZapResponseHeaders headers={response.headers || {}} />;
      case 'cookies':
        return (
          <div style={{ padding: '16px', color: 'var(--vscode-descriptionForeground)' }}>
            Cookies view not yet implemented
          </div>
        );
      case 'timeline':
        return (
          <div style={{ padding: '16px', color: 'var(--vscode-descriptionForeground)' }}>
            Timeline view not yet implemented
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--vscode-editor-background)'
    }}>
      {/* Response Status Bar */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--vscode-statusBar-background)',
        borderBottom: '1px solid var(--vscode-panel-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '13px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--vscode-foreground)', fontWeight: 'bold' }}>
              Status:
            </span>
            <span style={{
              color: getStatusColor(response.status),
              fontWeight: 'bold'
            }}>
              {response.status} {response.statusText || 'OK'}
            </span>
          </div>

          {response.time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--vscode-foreground)', fontWeight: 'bold' }}>
                Time:
              </span>
              <span style={{ color: 'var(--vscode-descriptionForeground)' }}>
                {response.time}ms
              </span>
            </div>
          )}

          {response.size && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--vscode-foreground)', fontWeight: 'bold' }}>
                Size:
              </span>
              <span style={{ color: 'var(--vscode-descriptionForeground)' }}>
                {response.size}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              padding: '4px 8px',
              border: '1px solid var(--vscode-button-border)',
              backgroundColor: 'var(--vscode-button-background)',
              color: 'var(--vscode-button-foreground)',
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(response, null, 2));
            }}
          >
            Copy Response
          </button>
        </div>
      </div>

      {/* Response Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--vscode-tab-border)',
        backgroundColor: 'var(--vscode-editorGroupHeader-tabsBackground)',
      }}>
        <button
          onClick={() => setActiveTab('body')}
          style={getTabStyle('body', activeTab === 'body')}
        >
          Body
        </button>

        <button
          onClick={() => setActiveTab('headers')}
          style={getTabStyle('headers', activeTab === 'headers')}
        >
          Headers
          {response.headers && Object.keys(response.headers).length > 0 && (
            <span style={{
              marginLeft: '6px',
              backgroundColor: 'var(--vscode-badge-background)',
              color: 'var(--vscode-badge-foreground)',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '10px'
            }}>
              {Object.keys(response.headers).length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cookies')}
          style={{...getTabStyle('cookies', activeTab === 'cookies'), opacity: 0.6}}
          disabled
        >
          Cookies
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          style={{...getTabStyle('timeline', activeTab === 'timeline'), opacity: 0.6}}
          disabled
        >
          Timeline
        </button>
      </div>

      {/* Response Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};
