import React, { useState, useEffect } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';

interface RequestHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export const ZapRequestHeadersTable: React.FC = () => {
  const { state, dispatch } = useZapPlayground();
  const [headers, setHeaders] = useState<RequestHeader[]>([]);

  // Initialize headers from state
  useEffect(() => {
    if (state.requestHeaders.length > 0) {
      setHeaders([...state.requestHeaders, { key: '', value: '', enabled: true }]);
    } else {
      setHeaders([{ key: '', value: '', enabled: true }]);
    }
  }, [state.requestHeaders]);

  const updateHeader = (index: number, field: keyof RequestHeader, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };

    // Add new empty row if the last row is being edited
    if (index === headers.length - 1 && field === 'key' && value) {
      newHeaders.push({ key: '', value: '', enabled: true });
    }

    setHeaders(newHeaders);

    // Update global state (exclude empty rows)
    const validHeaders = newHeaders.filter(h => h.key.trim());
    dispatch({ type: 'UPDATE_REQUEST_HEADERS', payload: validHeaders });
  };

  const deleteHeader = (index: number) => {
    if (headers.length > 1) {
      const newHeaders = headers.filter((_, i) => i !== index);
      setHeaders(newHeaders);

      const validHeaders = newHeaders.filter(h => h.key.trim());
      dispatch({ type: 'UPDATE_REQUEST_HEADERS', payload: validHeaders });
    }
  };

  const tableHeaderStyle = {
    backgroundColor: 'var(--vscode-list-activeSelectionBackground)',
    color: 'var(--vscode-list-activeSelectionForeground)',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    textAlign: 'left' as const,
    borderBottom: '1px solid var(--vscode-list-focusOutline)',
  };

  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid var(--vscode-input-border)',
    backgroundColor: 'var(--vscode-input-background)',
    color: 'var(--vscode-input-foreground)',
    fontSize: '13px',
    borderRadius: '3px',
  };

  const checkboxStyle = {
    width: '16px',
    height: '16px',
    margin: '0 auto',
    cursor: 'pointer',
  };

  // Common headers for autocomplete suggestions
  const commonHeaders = [
    'Accept',
    'Accept-Encoding',
    'Accept-Language',
    'Authorization',
    'Cache-Control',
    'Content-Type',
    'Cookie',
    'Origin',
    'Referer',
    'User-Agent',
    'X-API-Key',
    'X-Requested-With',
  ];

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          margin: 0,
          color: 'var(--vscode-foreground)',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Request Headers
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          color: 'var(--vscode-descriptionForeground)',
          fontSize: '12px'
        }}>
          Headers will be sent with your request
        </p>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--vscode-list-focusOutline)',
      }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: '40px' }}>✓</th>
            <th style={{ ...tableHeaderStyle, width: '35%' }}>Key</th>
            <th style={{ ...tableHeaderStyle, width: '55%' }}>Value</th>
            <th style={{ ...tableHeaderStyle, width: '40px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr key={index} style={{
              backgroundColor: index % 2 === 0
                ? 'var(--vscode-list-evenRowBackground)'
                : 'var(--vscode-list-oddRowBackground)',
            }}>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                  style={checkboxStyle}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Enter header name"
                  list={`header-suggestions-${index}`}
                  style={inputStyle}
                />
                <datalist id={`header-suggestions-${index}`}>
                  {commonHeaders.map(name => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Enter header value"
                  style={inputStyle}
                />
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                {headers.length > 1 && (
                  <button
                    onClick={() => deleteHeader(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--vscode-errorForeground)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px',
                      borderRadius: '3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--vscode-list-errorForeground)';
                      e.currentTarget.style.color = 'var(--vscode-list-activeSelectionForeground)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--vscode-errorForeground)';
                    }}
                    title="Delete header"
                  >
                    ×
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)', marginBottom: '8px' }}>
          {headers.filter(h => h.enabled && h.key.trim()).length} header(s)
        </div>

        {/* Quick add buttons for common headers */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {commonHeaders.slice(0, 6).map(headerName => {
            const exists = headers.some(h => h.key === headerName);
            return (
              <button
                key={headerName}
                onClick={() => {
                  if (!exists) {
                    const emptyIndex = headers.findIndex(h => !h.key.trim());
                    if (emptyIndex >= 0) {
                      updateHeader(emptyIndex, 'key', headerName);
                    }
                  }
                }}
                disabled={exists}
                style={{
                  padding: '4px 8px',
                  border: '1px solid var(--vscode-button-border)',
                  backgroundColor: exists
                    ? 'var(--vscode-button-secondaryBackground)'
                    : 'var(--vscode-button-background)',
                  color: exists
                    ? 'var(--vscode-button-secondaryForeground)'
                    : 'var(--vscode-button-foreground)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  cursor: exists ? 'not-allowed' : 'pointer',
                  opacity: exists ? 0.6 : 1,
                }}
              >
                + {headerName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
