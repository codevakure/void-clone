import React, { useState } from 'react';

interface ZapResponseBodyProps {
  response: any;
}

type BodyViewType = 'pretty' | 'raw' | 'preview';

export const ZapResponseBody: React.FC<ZapResponseBodyProps> = ({ response }) => {
  const [viewType, setViewType] = useState<BodyViewType>('pretty');

  const responseData = response.data;
  const contentType = response.headers?.['content-type'] || '';

  const isJSON = contentType.includes('application/json') ||
                 (typeof responseData === 'object' && responseData !== null);
  const isHTML = contentType.includes('text/html');
  const isXML = contentType.includes('text/xml') || contentType.includes('application/xml');
  const isImage = contentType.includes('image/');

  const getFormattedContent = () => {
    if (viewType === 'raw') {
      return typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData);
    }

    if (isJSON && typeof responseData === 'object') {
      return JSON.stringify(responseData, null, 2);
    }

    if (typeof responseData === 'string') {
      if (isJSON) {
        try {
          return JSON.stringify(JSON.parse(responseData), null, 2);
        } catch {
          return responseData;
        }
      }
      return responseData;
    }

    return JSON.stringify(responseData, null, 2);
  };

  const getLanguageHint = () => {
    if (isJSON) return 'json';
    if (isHTML) return 'html';
    if (isXML) return 'xml';
    return 'text';
  };

  const buttonStyle = (active: boolean) => ({
    padding: '6px 12px',
    border: '1px solid var(--vscode-button-border)',
    backgroundColor: active
      ? 'var(--vscode-button-background)'
      : 'var(--vscode-button-secondaryBackground)',
    color: active
      ? 'var(--vscode-button-foreground)'
      : 'var(--vscode-button-secondaryForeground)',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    marginRight: '6px',
  });

  return (
    <div style={{
      padding: '16px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--vscode-editor-background)'
    }}>
      {/* View Controls */}
      <div style={{
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--vscode-panel-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--vscode-foreground)',
            fontWeight: 'bold'
          }}>
            View:
          </span>

          <button
            onClick={() => setViewType('pretty')}
            style={buttonStyle(viewType === 'pretty')}
          >
            Pretty
          </button>

          <button
            onClick={() => setViewType('raw')}
            style={buttonStyle(viewType === 'raw')}
          >
            Raw
          </button>

          {isHTML && (
            <button
              onClick={() => setViewType('preview')}
              style={buttonStyle(viewType === 'preview')}
            >
              Preview
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--vscode-descriptionForeground)'
          }}>
            {contentType || 'Unknown type'}
          </span>

          <button
            onClick={() => {
              const content = getFormattedContent();
              navigator.clipboard.writeText(content);
            }}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--vscode-button-border)',
              backgroundColor: 'var(--vscode-button-background)',
              color: 'var(--vscode-button-foreground)',
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Response Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Image Preview */}
        {isImage && viewType !== 'raw' && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            border: '2px dashed var(--vscode-input-border)',
            borderRadius: '6px'
          }}>
            <div style={{ marginBottom: '12px', fontSize: '24px' }}>🖼️</div>
            <div style={{ color: 'var(--vscode-descriptionForeground)', marginBottom: '8px' }}>
              Image content detected
            </div>
            <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
              {contentType}
            </div>
          </div>
        )}

        {/* HTML Preview */}
        {isHTML && viewType === 'preview' && (
          <div style={{
            border: '1px solid var(--vscode-input-border)',
            borderRadius: '4px',
            height: '100%',
            backgroundColor: 'white',
          }}>
            <iframe
              srcDoc={typeof responseData === 'string' ? responseData : ''}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '4px',
              }}
              sandbox="allow-same-origin"
            />
          </div>
        )}

        {/* Text Content */}
        {(!isImage || viewType === 'raw') && !(isHTML && viewType === 'preview') && (
          <pre style={{
            margin: 0,
            padding: '16px',
            backgroundColor: 'var(--vscode-editor-background)',
            border: '1px solid var(--vscode-input-border)',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '13px',
            fontFamily: 'var(--vscode-editor-font-family, monospace)',
            color: 'var(--vscode-editor-foreground)',
            lineHeight: '1.4',
            whiteSpace: 'pre-wrap',
            height: '100%',
            boxSizing: 'border-box',
          }}>
            {getFormattedContent()}
          </pre>
        )}

        {/* Empty Response */}
        {!responseData && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--vscode-descriptionForeground)',
          }}>
            <div style={{ marginBottom: '8px', fontSize: '24px' }}>📄</div>
            <div>Response body is empty</div>
          </div>
        )}
      </div>

      {/* Response Size Info */}
      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid var(--vscode-panel-border)',
        fontSize: '11px',
        color: 'var(--vscode-descriptionForeground)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>
          Language: {getLanguageHint()}
        </span>
        <span>
          {typeof responseData === 'string'
            ? `${responseData.length} characters`
            : `${JSON.stringify(responseData).length} characters`
          }
        </span>
      </div>
    </div>
  );
};
