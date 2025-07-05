import React, { useState, useEffect } from 'react';
import { useZapPlayground } from '../playground/ZapPlayground.js';

type AuthType = 'none' | 'bearer' | 'basic' | 'api-key';

export const ZapAuthHeaders: React.FC = () => {
  const { state, dispatch } = useZapPlayground();
  const [authType, setAuthType] = useState<AuthType>('none');
  const [bearerToken, setBearerToken] = useState('');
  const [basicUsername, setBasicUsername] = useState('');
  const [basicPassword, setBasicPassword] = useState('');
  const [apiKeyKey, setApiKeyKey] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [apiKeyLocation, setApiKeyLocation] = useState<'header' | 'qp'>('header');

  // Parse existing auth from state
  useEffect(() => {
    if (state.auth && state.authHeader) {
      const [key, value] = state.authHeader.split(':');

      if (key === 'Authorization' && value.startsWith('Bearer ')) {
        setAuthType('bearer');
        setBearerToken(value.replace('Bearer ', ''));
      } else if (key === 'Authorization' && value.startsWith('Basic ')) {
        setAuthType('basic');
        try {
          const decoded = atob(value.replace('Basic ', ''));
          const [username, password] = decoded.split(':');
          setBasicUsername(username || '');
          setBasicPassword(password || '');
        } catch (e) {
          console.error('Error decoding basic auth:', e);
        }
      } else {
        setAuthType('api-key');
        setApiKeyKey(key);
        setApiKeyValue(value);
        setApiKeyLocation(state.authLocation);
      }
    }
  }, [state.auth, state.authHeader, state.authLocation]);

  const updateAuth = (type: AuthType) => {
    setAuthType(type);

    if (type === 'none') {
      dispatch({ type: 'SET_AUTH', payload: '' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: '' });
    }
  };

  const updateBearerAuth = (token: string) => {
    setBearerToken(token);
    if (token.trim()) {
      dispatch({ type: 'SET_AUTH', payload: 'bearer' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: `Authorization:Bearer ${token}` });
      dispatch({ type: 'SET_AUTH_LOCATION', payload: 'header' });
    } else {
      dispatch({ type: 'SET_AUTH', payload: '' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: '' });
    }
  };

  const updateBasicAuth = (username: string, password: string) => {
    setBasicUsername(username);
    setBasicPassword(password);

    if (username.trim() || password.trim()) {
      const encoded = btoa(`${username}:${password}`);
      dispatch({ type: 'SET_AUTH', payload: 'basic' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: `Authorization:Basic ${encoded}` });
      dispatch({ type: 'SET_AUTH_LOCATION', payload: 'header' });
    } else {
      dispatch({ type: 'SET_AUTH', payload: '' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: '' });
    }
  };

  const updateApiKeyAuth = (key: string, value: string, location: 'header' | 'qp') => {
    setApiKeyKey(key);
    setApiKeyValue(value);
    setApiKeyLocation(location);

    if (key.trim() && value.trim()) {
      dispatch({ type: 'SET_AUTH', payload: 'api-key' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: `${key}:${value}` });
      dispatch({ type: 'SET_AUTH_LOCATION', payload: location });
    } else {
      dispatch({ type: 'SET_AUTH', payload: '' });
      dispatch({ type: 'SET_AUTH_HEADER', payload: '' });
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
    marginBottom: '12px',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    color: 'var(--vscode-foreground)',
    fontSize: '13px',
    fontWeight: 'bold' as const,
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
          Authorization
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          color: 'var(--vscode-descriptionForeground)',
          fontSize: '12px'
        }}>
          Configure authentication for your request
        </p>
      </div>

      {/* Auth Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Type</label>
        <select
          value={authType}
          onChange={(e) => updateAuth(e.target.value as AuthType)}
          style={selectStyle}
        >
          <option value="none">No Auth</option>
          <option value="bearer">Bearer Token</option>
          <option value="basic">Basic Auth</option>
          <option value="api-key">API Key</option>
        </select>
      </div>

      {/* Auth Configuration */}
      {authType === 'bearer' && (
        <div>
          <label style={labelStyle}>Token</label>
          <input
            type="password"
            value={bearerToken}
            onChange={(e) => updateBearerAuth(e.target.value)}
            placeholder="Enter bearer token"
            style={inputStyle}
          />
          <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
            Token will be sent in the Authorization header as "Bearer &lt;token&gt;"
          </div>
        </div>
      )}

      {authType === 'basic' && (
        <div>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            value={basicUsername}
            onChange={(e) => updateBasicAuth(e.target.value, basicPassword)}
            placeholder="Enter username"
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={basicPassword}
            onChange={(e) => updateBasicAuth(basicUsername, e.target.value)}
            placeholder="Enter password"
            style={inputStyle}
          />
          <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
            Credentials will be Base64 encoded and sent in the Authorization header
          </div>
        </div>
      )}

      {authType === 'api-key' && (
        <div>
          <label style={labelStyle}>Key</label>
          <input
            type="text"
            value={apiKeyKey}
            onChange={(e) => updateApiKeyAuth(e.target.value, apiKeyValue, apiKeyLocation)}
            placeholder="Enter key name (e.g., X-API-Key)"
            style={inputStyle}
          />

          <label style={labelStyle}>Value</label>
          <input
            type="password"
            value={apiKeyValue}
            onChange={(e) => updateApiKeyAuth(apiKeyKey, e.target.value, apiKeyLocation)}
            placeholder="Enter API key value"
            style={inputStyle}
          />

          <label style={labelStyle}>Add to</label>
          <select
            value={apiKeyLocation}
            onChange={(e) => updateApiKeyAuth(apiKeyKey, apiKeyValue, e.target.value as 'header' | 'qp')}
            style={selectStyle}
          >
            <option value="header">Header</option>
            <option value="qp">Query Params</option>
          </select>
          <div style={{ fontSize: '12px', color: 'var(--vscode-descriptionForeground)' }}>
            API key will be added to the request {apiKeyLocation === 'header' ? 'headers' : 'query parameters'}
          </div>
        </div>
      )}

      {authType !== 'none' && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'var(--vscode-textBlockQuote-background)',
          border: '1px solid var(--vscode-textBlockQuote-border)',
          borderRadius: '3px',
          fontSize: '12px',
          color: 'var(--vscode-foreground)'
        }}>
          <strong>Preview:</strong>
          <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>
            {authType === 'bearer' && bearerToken && `Authorization: Bearer ${bearerToken.substring(0, 10)}...`}
            {authType === 'basic' && (basicUsername || basicPassword) && `Authorization: Basic ${btoa(`${basicUsername}:${basicPassword}`).substring(0, 10)}...`}
            {authType === 'api-key' && apiKeyKey && apiKeyValue && `${apiKeyKey}: ${apiKeyValue.substring(0, 10)}...`}
          </div>
        </div>
      )}
    </div>
  );
};
