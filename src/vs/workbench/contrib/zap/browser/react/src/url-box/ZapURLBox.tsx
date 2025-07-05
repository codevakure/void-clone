import React, { useState, useEffect, useRef } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

interface AutoGrowInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const AutoGrowInput: React.FC<AutoGrowInputProps> = ({ value, onChange, placeholder, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      style={{
        display: 'inline-grid',
        alignItems: 'center',
        justifyItems: 'start',
        gridTemplateColumns: 'min-content',
        gridTemplateRows: 'min-content',
      }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          gridArea: '1 / 1 / 2 / 2',
          width: 'auto',
          minWidth: '200px',
          maxWidth: '100%',
          resize: 'none',
          overflow: 'hidden',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--vscode-input-foreground)',
          fontSize: '14px',
          padding: 0,
        }}
      />
    </div>
  );
};

export function ZapURLBox() {
  const { state, dispatch } = useZapPlayground();
  const [urlInputWidth, setUrlInputWidth] = useState('auto');
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  const updateFormData = (updates: Partial<typeof state.formData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: updates });
  };

  const handleMethodChange = (method: string) => {
    updateFormData({ method });
  };

  const handleUrlChange = (url: string) => {
    updateFormData({ url });
  };

  const handleSendRequest = () => {
    dispatch({ type: 'SET_FORM_SUBMITTED', payload: true });
    dispatch({ type: 'SET_RESPONSE_UI', payload: true });

    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: 'SET_API_RESPONSE',
        payload: {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          data: { message: 'Success', timestamp: new Date().toISOString() }
        }
      });
    }, 1000);
  };

  // Update input width based on content
  useEffect(() => {
    if (hiddenSpanRef.current) {
      const textWidth = hiddenSpanRef.current.offsetWidth;
      setUrlInputWidth(`${Math.max(textWidth + 20, 200)}px`);
    }
  }, [state.formData.url]);

  return (
    <div
      className="zap-url-box"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--vscode-panel-border)',
        backgroundColor: 'var(--vscode-editor-background)',
        flexWrap: 'wrap'
      }}
    >
      {/* Method dropdown */}
      <select
        value={state.formData.method}
        onChange={(e) => handleMethodChange(e.target.value)}
        style={{
          padding: '6px 8px',
          border: '1px solid var(--vscode-input-border)',
          backgroundColor: 'var(--vscode-input-background)',
          color: 'var(--vscode-input-foreground)',
          borderRadius: '2px',
          fontSize: '13px',
          fontFamily: 'var(--vscode-font-family)',
          minWidth: '80px',
          cursor: 'pointer'
        }}
      >
        {HTTP_METHODS.map(method => (
          <option key={method} value={method}>{method}</option>
        ))}
      </select>

      {/* URL input container */}
      <div
        style={{
          flex: 1,
          minWidth: '200px',
          position: 'relative',
          border: '1px solid var(--vscode-input-border)',
          borderRadius: '2px',
          backgroundColor: 'var(--vscode-input-background)',
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <AutoGrowInput
          value={state.formData.url}
          onChange={handleUrlChange}
          placeholder="Enter request URL..."
        />

        {/* Hidden span for measuring text width */}
        <span
          ref={hiddenSpanRef}
          style={{
            visibility: 'hidden',
            position: 'absolute',
            left: '-9999px',
            fontSize: '14px',
            fontFamily: 'var(--vscode-font-family)',
            whiteSpace: 'nowrap'
          }}
        >
          {state.formData.url || 'Enter request URL...'}
        </span>
      </div>

      {/* Send button */}
      <button
        onClick={handleSendRequest}
        disabled={!state.formData.url.trim()}
        style={{
          padding: '6px 16px',
          border: 'none',
          borderRadius: '2px',
          backgroundColor: state.formData.url.trim()
            ? 'var(--vscode-button-background)'
            : 'var(--vscode-button-secondaryBackground)',
          color: state.formData.url.trim()
            ? 'var(--vscode-button-foreground)'
            : 'var(--vscode-button-secondaryForeground)',
          cursor: state.formData.url.trim() ? 'pointer' : 'not-allowed',
          fontSize: '13px',
          fontFamily: 'var(--vscode-font-family)',
          fontWeight: 500,
          minWidth: '60px'
        }}
      >
        Send
      </button>

      {/* Loading indicator */}
      {state.formSubmitted && !state.apiResponse && !state.apiError && (
        <div
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--vscode-progressBar-background)',
            borderTop: '2px solid var(--vscode-button-background)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
