import React, { useState } from 'react';

interface ZapResponseHeadersProps {
  headers: Record<string, string>;
}

export const ZapResponseHeaders: React.FC<ZapResponseHeadersProps> = ({ headers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const headerEntries = Object.entries(headers || {});
  const filteredHeaders = headerEntries.filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHeaderDescription = (headerName: string): string => {
    const descriptions: Record<string, string> = {
      'content-type': 'Indicates the media type of the resource',
      'content-length': 'The size of the entity-body in bytes',
      'content-encoding': 'Specifies the encoding transformations applied to the message body',
      'cache-control': 'Directives for caching mechanisms',
      'set-cookie': 'Used to send cookies from the server to the user agent',
      'location': 'Used in redirection responses to indicate the URL to redirect',
      'authorization': 'Contains credentials for authenticating the client',
      'user-agent': 'Contains information about the user agent',
      'accept': 'Indicates which content types the client can process',
      'accept-encoding': 'Indicates which content encodings the client can understand',
      'accept-language': 'Indicates which languages the client can understand',
      'host': 'Specifies the host and port number of the server',
      'referer': 'Contains the URL of the page that made the request',
      'origin': 'Indicates where a fetch originates from',
      'x-powered-by': 'Specifies the technology stack of the web server',
      'server': 'Contains information about the software used by the origin server',
      'date': 'Contains the date and time at which the message was sent',
      'etag': 'An identifier for a specific version of a resource',
      'last-modified': 'Contains the date and time the resource was last modified',
      'expires': 'Contains the date/time after which the response is considered stale',
      'access-control-allow-origin': 'Indicates whether the response can be shared with requesting code',
      'access-control-allow-methods': 'Indicates which HTTP methods are allowed when accessing the resource',
      'access-control-allow-headers': 'Indicates which headers can be used during the actual request',
    };

    return descriptions[headerName.toLowerCase()] || 'Custom header';
  };

  const isSecurityHeader = (headerName: string): boolean => {
    const securityHeaders = [
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security',
      'access-control-allow-origin',
      'access-control-allow-credentials',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-expose-headers',
      'access-control-max-age',
    ];
    return securityHeaders.includes(headerName.toLowerCase());
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid var(--vscode-input-border)',
    backgroundColor: 'var(--vscode-input-background)',
    color: 'var(--vscode-input-foreground)',
    fontSize: '13px',
    borderRadius: '3px',
    marginBottom: '12px',
  };

  const tableHeaderStyle = {
    backgroundColor: 'var(--vscode-list-activeSelectionBackground)',
    color: 'var(--vscode-list-activeSelectionForeground)',
    padding: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    textAlign: 'left' as const,
    borderBottom: '1px solid var(--vscode-list-focusOutline)',
  };

  if (!headers || Object.keys(headers).length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: 'var(--vscode-descriptionForeground)',
      }}>
        <div style={{ marginBottom: '8px', fontSize: '24px' }}>📋</div>
        <div>No response headers found</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'var(--vscode-editor-background)'
    }}>
      {/* Header Count and Search */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{
            margin: 0,
            color: 'var(--vscode-foreground)',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Response Headers ({headerEntries.length})
          </h3>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                const headersText = headerEntries
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n');
                navigator.clipboard.writeText(headersText);
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
              Copy All
            </button>
          </div>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search headers..."
          style={inputStyle}
        />
      </div>

      {/* Headers Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid var(--vscode-list-focusOutline)',
      }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, width: '30%' }}>Name</th>
            <th style={{ ...tableHeaderStyle, width: '50%' }}>Value</th>
            <th style={{ ...tableHeaderStyle, width: '20%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredHeaders.map(([key, value], index) => (
            <tr key={index} style={{
              backgroundColor: index % 2 === 0
                ? 'var(--vscode-list-evenRowBackground)'
                : 'var(--vscode-list-oddRowBackground)',
            }}>
              <td style={{
                padding: '12px',
                verticalAlign: 'top',
                borderBottom: '1px solid var(--vscode-list-focusOutline)',
                fontSize: '13px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--vscode-editor-font-family, monospace)',
                  fontWeight: 'bold',
                  color: 'var(--vscode-foreground)'
                }}>
                  {isSecurityHeader(key) && (
                    <span title="Security header" style={{ color: '#10b981' }}>🛡️</span>
                  )}
                  {key}
                </div>
              </td>
              <td style={{
                padding: '12px',
                verticalAlign: 'top',
                borderBottom: '1px solid var(--vscode-list-focusOutline)',
                fontSize: '13px',
                fontFamily: 'var(--vscode-editor-font-family, monospace)',
                color: 'var(--vscode-foreground)',
                wordBreak: 'break-all',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ flex: 1 }}>{value}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--vscode-descriptionForeground)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '2px',
                      borderRadius: '2px',
                      opacity: 0.7,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--vscode-toolbar-hoverBackground)';
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '0.7';
                    }}
                    title="Copy value"
                  >
                    📋
                  </button>
                </div>
              </td>
              <td style={{
                padding: '12px',
                verticalAlign: 'top',
                borderBottom: '1px solid var(--vscode-list-focusOutline)',
                fontSize: '11px',
                color: 'var(--vscode-descriptionForeground)',
                lineHeight: '1.4',
              }}>
                {getHeaderDescription(key)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredHeaders.length === 0 && searchTerm && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: 'var(--vscode-descriptionForeground)',
        }}>
          No headers match your search term "{searchTerm}"
        </div>
      )}

      {/* Security Headers Summary */}
      {filteredHeaders.length > 0 && !searchTerm && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'var(--vscode-textBlockQuote-background)',
          border: '1px solid var(--vscode-textBlockQuote-border)',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          <div style={{
            fontWeight: 'bold',
            marginBottom: '6px',
            color: 'var(--vscode-foreground)'
          }}>
            Security Headers Summary
          </div>
          <div style={{ color: 'var(--vscode-descriptionForeground)' }}>
            {headerEntries.filter(([key]) => isSecurityHeader(key)).length} of {headerEntries.length} headers are security-related
          </div>
        </div>
      )}
    </div>
  );
};
