/**
 * ZapApiRequestEditor - Unified request editor for the main editor panel
 * This component handles both request editing and response viewing
 */

import * as React from 'react';
import { useZapApi } from '../providers/ZapReactProvider.js';

interface ZapApiRequestEditorProps {
  /** Optional: Pass request data directly (for standalone use) */
  request?: any;
  collectionId?: string;
  /** Display mode: 'full' for main editor, 'compact' for smaller spaces */
  mode?: 'full' | 'compact';
}

export const ZapApiRequestEditor: React.FC<ZapApiRequestEditorProps> = ({
  request: propsRequest,
  collectionId: propsCollectionId,
  mode = 'full'
}) => {
  const { state, actions } = useZapApi();

  // Use props request if provided, otherwise use active request from state
  const activeRequest = propsRequest || state.activeRequest;
  const collectionId = propsCollectionId || state.activeCollection?.id;

  // Use global view state instead of local state
  const activeView = state.viewState.activeView;
  const [response, setResponse] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock send request function
  const sendRequest = async () => {
    if (!activeRequest) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Request completed successfully',
          timestamp: new Date().toISOString(),
          method: activeRequest.method,
          url: activeRequest.url
        }, null, 2),
        responseTime: Math.floor(Math.random() * 500) + 100,
        size: Math.floor(Math.random() * 1000) + 500
      };
      setResponse(mockResponse);

      // Also update global state
      if (actions.sendRequest) {
        actions.sendRequest(activeRequest);
      }
    } catch (error) {
      setResponse({
        status: 500,
        statusText: 'Error',
        body: JSON.stringify({ error: 'Request failed' }, null, 2)
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate ZAP file content
  const generateZapContent = () => {
    if (!activeRequest) return '';

    const headers = activeRequest.headers || {};
    const headersSection = Object.keys(headers).length > 0 ?
    Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n') :
    '';

    return `meta {
  name: ${activeRequest.name}
  type: http
  seq: 1
}

${activeRequest.method.toLowerCase()} {
  url: ${activeRequest.url || 'https://api.example.com/endpoint'}
  body: ${activeRequest.body ? 'json' : 'none'}
  auth: none
}

${headersSection ? `headers {\n${headersSection}\n}\n` : ''}${activeRequest.body ? `body:json {\n${typeof activeRequest.body === 'string' ? activeRequest.body : activeRequest.body.content || '{}'}\n}\n` : ''}

tests {
  test("should return 200", function() {
    expect(res.getStatus()).to.equal(200);
  });
}`;
  };

  if (!activeRequest) {
    return (
      <div className="void-h-full void-flex void-items-center void-justify-center void-bg-[var(--vscode-editor-background)] void-text-[var(--vscode-editor-foreground)]">
				<div className="void-text-center void-text-[var(--vscode-descriptionForeground)]">
					<div className="void-mb-2 void-text-4xl">⚡</div>
					<div className="void-text-lg void-mb-2">No Request Selected</div>
					<div className="void-text-sm">Select a request from the collection tree to get started</div>
				</div>
			</div>);

  }

  if (activeView === 'zap-editor') {
    return (
      <div className="void-h-full void-flex void-flex-col void-bg-[var(--vscode-editor-background)]">
				{/* ZAP Header */}
				<div className="void-flex void-items-center void-justify-between void-p-4 void-border-b void-border-[var(--vscode-panel-border)]">
					<div className="void-flex void-items-center void-space-x-3">
						<span className="void-text-2xl">⚡</span>
						<div>
							<h1 className="void-text-lg void-font-semibold void-text-[var(--vscode-editor-foreground)]">
								{activeRequest.name}.zap
							</h1>
							<p className="void-text-sm void-text-[var(--vscode-descriptionForeground)]">
								Zap format file content
							</p>
						</div>
					</div>
					<button
            className="void-px-4 void-py-2 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)]"
            onClick={() => actions.toggleCenterView()}>
            
						🔄 Back to Request/Response
					</button>
				</div>

				{/* ZAP Content */}
				<div className="void-flex-1 void-p-4">
					<pre className="void-h-full void-bg-[var(--vscode-textCodeBlock-background)] void-text-[var(--vscode-editor-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-4 void-text-sm void-font-mono void-overflow-auto void-whitespace-pre-wrap">
						{generateZapContent()}
					</pre>
				</div>
			</div>);

  }

  // Main Request/Response view
  return (
    <div className="void-h-full void-flex void-flex-col void-bg-[var(--vscode-editor-background)]">
			{/* Header with request info and controls */}
			<div className="void-flex void-items-center void-justify-between void-p-4 void-border-b void-border-[var(--vscode-panel-border)]">
				<div className="void-flex void-items-center void-space-x-3">
					<span className={`void-px-3 void-py-1 void-text-sm void-rounded void-text-white void-font-medium ${
          activeRequest.method === 'GET' ? "void-bg-green-600" :
          activeRequest.method === 'POST' ? "void-bg-blue-600" :
          activeRequest.method === 'PUT' ? "void-bg-yellow-600" :
          activeRequest.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"}`}>

            
						{activeRequest.method}
					</span>
					<div>
						<h1 className="void-text-lg void-font-semibold void-text-[var(--vscode-editor-foreground)]">
							{activeRequest.name}
						</h1>
						<p className="void-text-sm void-text-[var(--vscode-descriptionForeground)]">
							{activeRequest.url}
						</p>
					</div>
				</div>
				<div className="void-flex void-items-center void-space-x-2">
					<button
            className="void-px-3 void-py-2 void-text-sm void-bg-[var(--vscode-button-secondaryBackground)] void-text-[var(--vscode-button-secondaryForeground)] void-rounded hover:void-bg-[var(--vscode-button-secondaryHoverBackground)] void-border void-border-[var(--vscode-button-border)]"
            onClick={() => actions.toggleCenterView()}>
            
						⚡ View ZAP
					</button>
					<button
            className="void-px-6 void-py-2 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)] disabled:void-opacity-50"
            onClick={sendRequest}
            disabled={isLoading}>
            
						{isLoading ? '⏳ Sending...' : '⚡ Send Request'}
					</button>
				</div>
			</div>

			{/* Request URL bar */}
			<div className="void-flex void-items-center void-space-x-2 void-p-4 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-editor-background)]">
				<select
          className="void-px-3 void-py-2 void-text-sm void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded"
          value={activeRequest.method}
          disabled>
          
					<option>{activeRequest.method}</option>
				</select>
				<input
          className="void-flex-1 void-px-3 void-py-2 void-text-sm void-bg-[var(--vscode-input-background)] void-text-[var(--vscode-input-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded"
          value={activeRequest.url || ''}
          readOnly
          placeholder="Request URL" />
        
			</div>

			{/* Main content split view */}
			<div className="void-flex-1 void-flex">
				{/* Request panel */}
				<div className="void-w-1/2 void-flex void-flex-col void-border-r void-border-[var(--vscode-panel-border)]">
					<div className="void-p-3 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
						<h3 className="void-font-medium void-text-[var(--vscode-tab-activeForeground)]">Request</h3>
					</div>
					<div className="void-flex-1 void-p-4 void-overflow-y-auto">
						{/* Headers */}
						<div className="void-mb-6">
							<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
								Headers
							</label>
							<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
								{activeRequest.headers && Object.keys(activeRequest.headers).length > 0 ?
                Object.entries(activeRequest.headers).map(([key, value], index) =>
                <div key={index} className="void-flex void-mb-2 last:void-mb-0">
											<span className="void-w-1/3 void-text-sm void-text-[var(--vscode-input-foreground)] void-pr-2 void-font-medium">
												{key}:
											</span>
											<span className="void-flex-1 void-text-sm void-text-[var(--vscode-input-foreground)]">
												{String(value)}
											</span>
										</div>
                ) :

                <div className="void-text-sm void-text-[var(--vscode-descriptionForeground)]">
										No headers
									</div>
                }
							</div>
						</div>

						{/* Body */}
						{activeRequest.body &&
            <div>
								<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
									Body
								</label>
								<pre className="void-bg-[var(--vscode-textCodeBlock-background)] void-text-[var(--vscode-editor-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3 void-text-sm void-font-mono void-overflow-x-auto void-whitespace-pre-wrap">
									{typeof activeRequest.body === 'string' ? activeRequest.body : activeRequest.body.content || '{}'}
								</pre>
							</div>
            }
					</div>
				</div>

				{/* Response panel */}
				<div className="void-w-1/2 void-flex void-flex-col">
					<div className="void-p-3 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)] void-flex void-items-center void-justify-between">
						<h3 className="void-font-medium void-text-[var(--vscode-tab-activeForeground)]">Response</h3>
						{response &&
            <div className="void-flex void-items-center void-space-x-2 void-text-xs">
								<span className={`void-px-2 void-py-1 void-rounded void-text-white void-font-medium ${
              response.status >= 200 && response.status < 300 ? "void-bg-green-600" :
              response.status >= 400 ? "void-bg-red-600" : "void-bg-yellow-600"}`}>

                
									{response.status} {response.statusText}
								</span>
								{response.responseTime &&
              <span className="void-text-[var(--vscode-descriptionForeground)]">{response.responseTime}ms</span>
              }
								{response.size &&
              <span className="void-text-[var(--vscode-descriptionForeground)]">{response.size}B</span>
              }
							</div>
            }
					</div>
					<div className="void-flex-1 void-p-4 void-overflow-y-auto">
						{response ?
            <>
								{/* Response headers */}
								{response.headers &&
              <div className="void-mb-6">
										<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
											Headers
										</label>
										<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
											{Object.entries(response.headers).map(([key, value], index) =>
                  <div key={index} className="void-flex void-mb-2 last:void-mb-0">
													<span className="void-w-1/3 void-text-sm void-text-[var(--vscode-input-foreground)] void-pr-2 void-font-medium">
														{key}:
													</span>
													<span className="void-flex-1 void-text-sm void-text-[var(--vscode-input-foreground)]">
														{String(value)}
													</span>
												</div>
                  )}
										</div>
									</div>
              }

								{/* Response body */}
								<div>
									<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
										Body
									</label>
									<pre className="void-bg-[var(--vscode-textCodeBlock-background)] void-text-[var(--vscode-editor-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3 void-text-sm void-font-mono void-overflow-x-auto void-whitespace-pre-wrap">
										{response.body || 'No response body'}
									</pre>
								</div>
							</> :

            <div className="void-flex void-items-center void-justify-center void-h-full">
								<div className="void-text-center void-text-[var(--vscode-descriptionForeground)]">
									<div className="void-text-4xl void-mb-4">⚡</div>
									<p className="void-text-lg void-mb-2">Ready to Send</p>
									<p className="void-text-sm">Click the "Send Request" button to execute the request</p>
								</div>
							</div>
            }
					</div>
				</div>
			</div>
		</div>);

};