import React, { useState, useReducer, createContext, useContext } from 'react';
import '../styles.css';
import { ZapURLBox } from '../url-box/index.js';
import { ZapPayloadForm } from '../payload-form/index.js';
import { ZapResponseViewer } from '../response-viewer/index.js';

// Define the state interface
interface ZapPlaygroundState {
  splitView: 'H' | 'V'; // Horizontal or Vertical
  responsePanelMinimized: boolean;
  infoPanelOpened: boolean;
  formData: {
    method: string;
    url: string;
    params: string;
    payload: any;
  };
  auth: string;
  authHeader: string;
  authLocation: 'header' | 'qp';
  requestHeaders: Array<{ key: string; value: string; enabled: boolean }>;
  formSubmitted: boolean;
  responseUI: boolean;
  apiResponse: any;
  apiError: any;
}

// Initial state
const initialState: ZapPlaygroundState = {
  splitView: 'H',
  responsePanelMinimized: false,
  infoPanelOpened: false,
  formData: {
    method: 'GET',
    url: '',
    params: '',
    payload: null,
  },
  auth: '',
  authHeader: '',
  authLocation: 'header',
  requestHeaders: [],
  formSubmitted: false,
  responseUI: false,
  apiResponse: {},
  apiError: null,
};

// Action types
type ZapPlaygroundAction =
  | { type: 'SET_SPLIT_VIEW'; payload: 'H' | 'V' }
  | { type: 'TOGGLE_RESPONSE_PANEL' }
  | { type: 'TOGGLE_INFO_PANEL' }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<ZapPlaygroundState['formData']> }
  | { type: 'SET_AUTH'; payload: string }
  | { type: 'SET_AUTH_HEADER'; payload: string }
  | { type: 'SET_AUTH_LOCATION'; payload: 'header' | 'qp' }
  | { type: 'UPDATE_REQUEST_HEADERS'; payload: Array<{ key: string; value: string; enabled: boolean }> }
  | { type: 'SET_FORM_SUBMITTED'; payload: boolean }
  | { type: 'SET_RESPONSE_UI'; payload: boolean }
  | { type: 'SET_API_RESPONSE'; payload: any }
  | { type: 'SET_API_ERROR'; payload: any };

// Reducer function
function zapPlaygroundReducer(state: ZapPlaygroundState, action: ZapPlaygroundAction): ZapPlaygroundState {
  switch (action.type) {
    case 'SET_SPLIT_VIEW':
      return { ...state, splitView: action.payload };
    case 'TOGGLE_RESPONSE_PANEL':
      return { ...state, responsePanelMinimized: !state.responsePanelMinimized };
    case 'TOGGLE_INFO_PANEL':
      return { ...state, infoPanelOpened: !state.infoPanelOpened };
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_AUTH':
      return { ...state, auth: action.payload };
    case 'SET_AUTH_HEADER':
      return { ...state, authHeader: action.payload };
    case 'SET_AUTH_LOCATION':
      return { ...state, authLocation: action.payload };
    case 'UPDATE_REQUEST_HEADERS':
      return { ...state, requestHeaders: action.payload };
    case 'SET_FORM_SUBMITTED':
      return { ...state, formSubmitted: action.payload };
    case 'SET_RESPONSE_UI':
      return { ...state, responseUI: action.payload };
    case 'SET_API_RESPONSE':
      return { ...state, apiResponse: action.payload };
    case 'SET_API_ERROR':
      return { ...state, apiError: action.payload };
    default:
      return state;
  }
}

// Context
export const ZapPlaygroundContext = createContext<{
  state: ZapPlaygroundState;
  dispatch: React.Dispatch<ZapPlaygroundAction>;
} | undefined>(undefined);

// Hook to use context
export function useZapPlayground() {
  const context = useContext(ZapPlaygroundContext);
  if (!context) {
    throw new Error('useZapPlayground must be used within a ZapPlaygroundProvider');
  }
  return context;
}

// Provider component
export function ZapPlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(zapPlaygroundReducer, initialState);

  return (
    <ZapPlaygroundContext.Provider value={{ state, dispatch }}>
      {children}
    </ZapPlaygroundContext.Provider>
  );
}

// Main component
export function ZapPlayground() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <ZapPlaygroundProvider>
      <div
        className={`zap-playground ${isFullScreen ? 'fullscreen' : ''}`}
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--vscode-editor-background)',
          color: 'var(--vscode-editor-foreground)',
          fontFamily: 'var(--vscode-font-family)',
          fontSize: 'var(--vscode-font-size)',
          overflow: 'hidden'
        }}
      >
        <ZapMainContent />
      </div>
    </ZapPlaygroundProvider>
  );
}

function ZapMainContent() {
  const { state, dispatch } = useZapPlayground();

  const toggleSplitView = () => {
    dispatch({ type: 'SET_SPLIT_VIEW', payload: state.splitView === 'H' ? 'V' : 'H' });
  };

  const toggleResponsePanel = () => {
    dispatch({ type: 'TOGGLE_RESPONSE_PANEL' });
  };

  return (
    <div className="zap-main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with controls */}
      <div
        className="zap-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          borderBottom: '1px solid var(--vscode-panel-border)',
          backgroundColor: 'var(--vscode-panel-background)'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>API Playground</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={toggleSplitView}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--vscode-button-border)',
              backgroundColor: 'var(--vscode-button-background)',
              color: 'var(--vscode-button-foreground)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {state.splitView === 'H' ? 'Vertical' : 'Horizontal'}
          </button>
          <button
            onClick={toggleResponsePanel}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--vscode-button-border)',
              backgroundColor: 'var(--vscode-button-background)',
              color: 'var(--vscode-button-foreground)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {state.responsePanelMinimized ? 'Show Response' : 'Hide Response'}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div
        className="zap-content-area"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: state.splitView === 'H' ? 'row' : 'column',
          overflow: 'hidden'
        }}
      >
        {/* Request panel */}
        <div
          className="zap-request-panel"
          style={{
            flex: state.responsePanelMinimized ? 1 : 0.5,
            display: 'flex',
            flexDirection: 'column',
            borderRight: state.splitView === 'H' ? '1px solid var(--vscode-panel-border)' : 'none',
            borderBottom: state.splitView === 'V' ? '1px solid var(--vscode-panel-border)' : 'none',
            overflow: 'hidden'
          }}
        >
          <ZapURLBox />
          <ZapPayloadForm />
        </div>

        {/* Response panel */}
        {!state.responsePanelMinimized && (
          <div
            className="zap-response-panel"
            style={{
              flex: 0.5,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <ZapResponseViewer />
          </div>
        )}
      </div>
    </div>
  );
}
