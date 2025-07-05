import React, { useState, useEffect } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';

type BodyType = 'none' | 'raw' | 'form-data' | 'x-www-form-urlencoded' | 'binary';
type RawType = 'text' | 'json' | 'xml' | 'html' | 'javascript';

interface FormDataItem {
  key: string;
  value: string;
  type: 'text' | 'file';
  enabled: boolean;
}

export const ZapRequestBody: React.FC = () => {
  const { state, dispatch } = useZapPlayground();
  const [bodyType, setBodyType] = useState<BodyType>('none');
  const [rawType, setRawType] = useState<RawType>('text');
  const [rawContent, setRawContent] = useState('');
  const [formData, setFormData] = useState<FormDataItem[]>([
    { key: '', value: '', type: 'text', enabled: true }
  ]);

  // Parse existing payload from state
  useEffect(() => {
    if (state.formData.payload) {
      // Try to determine the body type from the payload
      if (typeof state.formData.payload === 'string') {
        setBodyType('raw');
        setRawContent(state.formData.payload);

        // Try to determine raw type
        try {
          JSON.parse(state.formData.payload);
          setRawType('json');
        } catch {
          if (state.formData.payload.includes('<') && state.formData.payload.includes('>')) {
            setRawType('xml');
          } else {
            setRawType('text');
          }
        }
      } else {
        setBodyType('form-data');
        // Handle form data parsing if needed
      }
    }
  }, [state.formData.payload]);

  const updateBodyType = (type: BodyType) => {
    setBodyType(type);

    if (type === 'none') {
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: null } });
    }
  };

  const updateRawContent = (content: string) => {
    setRawContent(content);
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: content } });
  };

  const updateFormDataItem = (index: number, field: keyof FormDataItem, value: string | boolean) => {
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [field]: value };

    // Add new empty row if the last row is being edited
    if (index === formData.length - 1 && field === 'key' && value) {
      newFormData.push({ key: '', value: '', type: 'text', enabled: true });
    }

    setFormData(newFormData);

    // Update global state
    const validItems = newFormData.filter(item => item.key.trim() && item.enabled);
    if (validItems.length > 0) {
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: validItems } });
    } else {
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: null } });
    }
  };

  const deleteFormDataItem = (index: number) => {
    if (formData.length > 1) {
      const newFormData = formData.filter((_, i) => i !== index);
      setFormData(newFormData);

      const validItems = newFormData.filter(item => item.key.trim() && item.enabled);
      if (validItems.length > 0) {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: validItems } });
      } else {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: { payload: null } });
      }
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid var(--vscode-input-border)',
    backgroundColor: 'var(--vscode-input-background)',
    color: 'var(--vscode-input-foreground)',
    fontSize: '13px',
    borderRadius: '3px',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '200px',
    resize: 'vertical' as const,
    fontFamily: 'var(--vscode-editor-font-family, monospace)',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: 'var(--vscode-foreground)',
    fontSize: '13px',
    fontWeight: 'bold' as const,
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

  const checkboxStyle = {
    width: '16px',
    height: '16px',
    margin: '0 auto',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          margin: 0,
          color: 'var(--vscode-foreground)',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Request Body
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          color: 'var(--vscode-descriptionForeground)',
          fontSize: '12px'
        }}>
          Configure the request body data
        </p>
      </div>

      {/* Body Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Body Type</label>
        <select
          value={bodyType}
          onChange={(e) => updateBodyType(e.target.value as BodyType)}
          style={selectStyle}
        >
          <option value="none">None</option>
          <option value="raw">Raw</option>
          <option value="form-data">Form Data</option>
          <option value="x-www-form-urlencoded">URL Encoded</option>
          <option value="binary">Binary</option>
        </select>
      </div>

      {/* Raw Body */}
      {bodyType === 'raw' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
            <label style={labelStyle}>Format</label>
            <select
              value={rawType}
              onChange={(e) => setRawType(e.target.value as RawType)}
              style={{ ...selectStyle, width: 'auto', marginBottom: 0 }}
            >
              <option value="text">Text</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="html">HTML</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <textarea
            value={rawContent}
            onChange={(e) => updateRawContent(e.target.value)}
            placeholder={`Enter ${rawType} content...`}
            style={textareaStyle}
          />

          {rawType === 'json' && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(rawContent), null, 2);
                    setRawContent(formatted);
                    updateRawContent(formatted);
                  } catch (e) {
                    // Invalid JSON, do nothing
                  }
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
                Format JSON
              </button>
              <button
                onClick={() => {
                  try {
                    const minified = JSON.stringify(JSON.parse(rawContent));
                    setRawContent(minified);
                    updateRawContent(minified);
                  } catch (e) {
                    // Invalid JSON, do nothing
                  }
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
                Minify JSON
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form Data */}
      {(bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') && (
        <div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid var(--vscode-list-focusOutline)',
          }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '40px' }}>✓</th>
                <th style={{ ...tableHeaderStyle, width: '35%' }}>Key</th>
                <th style={{ ...tableHeaderStyle, width: '45%' }}>Value</th>
                {bodyType === 'form-data' && (
                  <th style={{ ...tableHeaderStyle, width: '80px' }}>Type</th>
                )}
                <th style={{ ...tableHeaderStyle, width: '40px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((item, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0
                    ? 'var(--vscode-list-evenRowBackground)'
                    : 'var(--vscode-list-oddRowBackground)',
                }}>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => updateFormDataItem(index, 'enabled', e.target.checked)}
                      style={checkboxStyle}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="text"
                      value={item.key}
                      onChange={(e) => updateFormDataItem(index, 'key', e.target.value)}
                      placeholder="Enter key"
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                  </td>
                  <td style={{ padding: '8px' }}>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateFormDataItem(index, 'value', e.target.value)}
                      placeholder="Enter value"
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                  </td>
                  {bodyType === 'form-data' && (
                    <td style={{ padding: '8px' }}>
                      <select
                        value={item.type}
                        onChange={(e) => updateFormDataItem(index, 'type', e.target.value as 'text' | 'file')}
                        style={{ ...selectStyle, marginBottom: 0 }}
                      >
                        <option value="text">Text</option>
                        <option value="file">File</option>
                      </select>
                    </td>
                  )}
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {formData.length > 1 && (
                      <button
                        onClick={() => deleteFormDataItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--vscode-errorForeground)',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '4px',
                          borderRadius: '3px',
                        }}
                        title="Delete item"
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
            {formData.filter(item => item.enabled && item.key.trim()).length} item(s)
          </div>
        </div>
      )}

      {/* Binary */}
      {bodyType === 'binary' && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          border: '2px dashed var(--vscode-input-border)',
          borderRadius: '6px',
          color: 'var(--vscode-descriptionForeground)',
        }}>
          <div style={{ marginBottom: '8px', fontSize: '24px' }}>📁</div>
          <div>Binary file upload will be implemented in a future version</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            For now, use form-data type for file uploads
          </div>
        </div>
      )}
    </div>
  );
};
