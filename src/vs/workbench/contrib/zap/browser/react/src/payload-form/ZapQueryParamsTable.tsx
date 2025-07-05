import React, { useState, useEffect } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';

interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

export const ZapQueryParamsTable: React.FC = () => {
  const { state, dispatch } = useZapPlayground();
  const [params, setParams] = useState<QueryParam[]>([]);

  // Parse existing params from state
  useEffect(() => {
    if (state.formData.params) {
      const parsedParams = parseQueryString(state.formData.params);
      setParams(parsedParams);
    } else {
      // Add empty row if no params
      setParams([{ key: '', value: '', enabled: true }]);
    }
  }, [state.formData.params]);

  const parseQueryString = (queryString: string): QueryParam[] => {
    if (!queryString || queryString.trim() === '') {
      return [{ key: '', value: '', enabled: true }];
    }

    // Remove leading ? if present
    const cleanString = queryString.startsWith('?') ? queryString.slice(1) : queryString;

    const params = cleanString.split('&').map(param => {
      const [key, value] = param.split('=');
      return {
        key: decodeURIComponent(key || ''),
        value: decodeURIComponent(value || ''),
        enabled: true,
      };
    });

    // Always have at least one empty row
    if (params.length === 0 || (params.length === 1 && !params[0].key)) {
      params.push({ key: '', value: '', enabled: true });
    } else {
      params.push({ key: '', value: '', enabled: true });
    }

    return params;
  };

  const serializeParams = (paramsList: QueryParam[]): string => {
    const enabledParams = paramsList.filter(p => p.enabled && p.key.trim());
    if (enabledParams.length === 0) return '';

    const queryString = enabledParams
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');

    return queryString ? `?${queryString}` : '';
  };

  const updateParam = (index: number, field: keyof QueryParam, value: string | boolean) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };

    // Add new empty row if the last row is being edited
    if (index === params.length - 1 && field === 'key' && value) {
      newParams.push({ key: '', value: '', enabled: true });
    }

    setParams(newParams);

    // Update global state
    const queryString = serializeParams(newParams);
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { params: queryString } });
  };

  const deleteParam = (index: number) => {
    if (params.length > 1) {
      const newParams = params.filter((_, i) => i !== index);
      setParams(newParams);

      const queryString = serializeParams(newParams);
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { params: queryString } });
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

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          margin: 0,
          color: 'var(--vscode-foreground)',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Query Parameters
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          color: 'var(--vscode-descriptionForeground)',
          fontSize: '12px'
        }}>
          Parameters will be automatically URL-encoded
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
          {params.map((param, index) => (
            <tr key={index} style={{
              backgroundColor: index % 2 === 0
                ? 'var(--vscode-list-evenRowBackground)'
                : 'var(--vscode-list-oddRowBackground)',
            }}>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={param.enabled}
                  onChange={(e) => updateParam(index, 'enabled', e.target.checked)}
                  style={checkboxStyle}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) => updateParam(index, 'key', e.target.value)}
                  placeholder="Enter key"
                  style={inputStyle}
                />
              </td>
              <td style={{ padding: '8px' }}>
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => updateParam(index, 'value', e.target.value)}
                  placeholder="Enter value"
                  style={inputStyle}
                />
              </td>
              <td style={{ padding: '8px', textAlign: 'center' }}>
                {params.length > 1 && (
                  <button
                    onClick={() => deleteParam(index)}
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
                    title="Delete parameter"
                  >
                    ×
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
        {params.filter(p => p.enabled && p.key.trim()).length} parameter(s)
      </div>
    </div>
  );
};
