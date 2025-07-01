/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';
import { ZapRequest, ZapResponse } from '../../../../../common/zapApiTypes.js';

interface RequestResponseEditorProps {
  request: ZapRequest;
  collectionId?: string;
  mode?: 'full' | 'compact';
}

/**
 * RequestResponseEditor - The main editor component for API requests
 * Features:
 * - Request panel (method, URL, headers, body)
 * - Response panel (status, headers, body)
 * - Send request functionality
 * Note: Code view toggle is handled by ZapFileEditor at the VS Code level
 */
export const RequestResponseEditor: React.FC<RequestResponseEditorProps> = ({
  request,
  collectionId,
  mode = 'full'
}) => {
  const [response, setResponse] = React.useState<ZapResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendRequest = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual request sending
      setTimeout(() => {
        setResponse({
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          body: '{"message": "Hello World"}',
          responseTime: 150,
          size: 28
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('Request failed:', error);
    }
  };

  // Main Request/Response Design View
  return (
    <div className="void-void-h-full void-void-bg-[var(--vscode-editor-background)] void-void-text-[var(--vscode-editor-foreground)] void-void-flex void-void-flex-col">
			{/* Header with controls */}
			<div className="void-void-flex void-void-items-center void-void-justify-between void-void-p-3 void-void-border-b void-void-border-[var(--vscode-panel-border)]">
				<div className="void-void-flex void-void-items-center void-void-space-x-2">
					<span className={`void-void-px-2 void-void-py-1 void-void-text-xs void-void-rounded void-void-text-white void-void-font-medium ${
          request.method === 'GET' ? "void-void-bg-green-600" :
          request.method === 'POST' ? "void-void-bg-blue-600" :
          request.method === 'PUT' ? "void-void-bg-yellow-600" :
          request.method === 'DELETE' ? "void-void-bg-red-600" : "void-void-bg-gray-600"}`}>
            
						{request.method}
					</span>
					<span className="void-void-text-sm void-void-font-medium">{request.name}</span>
				</div>

				<div className="void-void-flex void-void-items-center void-void-space-x-2">
					<button
            className="void-void-px-4 void-void-py-1 void-void-text-sm void-void-bg-[var(--vscode-button-background)] void-void-text-[var(--vscode-button-foreground)] void-void-rounded hover:void-void-bg-[var(--vscode-button-hoverBackground)] disabled:void-void-opacity-50"
            onClick={handleSendRequest}
            disabled={isLoading}>
            
						{isLoading ? 'Sending...' : 'Send'}
					</button>
				</div>
			</div>

			{/* Content area - split panels */}
			<div className="void-void-flex-1 void-void-flex">
				{/* Request panel */}
				<div className="void-void-w-1/2 void-void-border-r void-void-border-[var(--vscode-panel-border)] void-void-flex void-void-flex-col">
					<div className="void-void-p-2 void-void-border-b void-void-border-[var(--vscode-panel-border)] void-void-bg-[var(--vscode-tab-activeBackground)]">
						<span className="void-void-text-sm void-void-font-semibold">Request</span>
					</div>
					<div className="void-void-flex-1 void-void-p-3 void-void-overflow-y-auto void-void-space-y-4">
						{/* URL */}
						<div>
							<label className="void-void-block void-void-mb-2 void-void-text-sm void-void-font-medium">URL</label>
							<div className="void-void-bg-[var(--vscode-input-background)] void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded void-void-p-3 void-void-text-sm void-void-font-mono">
								{request.url || 'No URL specified'}
							</div>
						</div>

						{/* Headers */}
						{request.headers && Object.keys(request.headers).length > 0 &&
            <div>
								<label className="void-void-block void-void-mb-2 void-void-text-sm void-void-font-medium">Headers</label>
								<div className="void-void-bg-[var(--vscode-input-background)] void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded void-void-p-3">
									{Object.entries(request.headers).map(([key, value]) =>
                <div key={key} className="void-void-flex void-void-justify-between void-void-py-1 void-void-text-sm">
											<span className="void-void-font-medium">{key}:</span>
											<span className="void-void-text-[var(--vscode-descriptionForeground)]">{value}</span>
										</div>
                )}
								</div>
							</div>
            }

						{/* Body */}
						{request.body && request.body.content &&
            <div>
								<label className="void-void-block void-void-mb-2 void-void-text-sm void-void-font-medium">Body</label>
								<pre className="void-void-text-sm void-void-whitespace-pre-wrap void-void-font-mono void-void-bg-[var(--vscode-textCodeBlock-background)] void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded void-void-p-3">
									{request.body.content}
								</pre>
							</div>
            }

						{(!request.body || !request.body.content) &&
            <div className="void-void-text-[var(--vscode-descriptionForeground)] void-void-text-sm void-void-p-3 void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded">
								No request body
							</div>
            }
					</div>
				</div>

				{/* Response panel */}
				<div className="void-void-w-1/2 void-void-flex void-void-flex-col">
					<div className="void-void-p-2 void-void-border-b void-void-border-[var(--vscode-panel-border)] void-void-bg-[var(--vscode-tab-activeBackground)] void-void-flex void-void-items-center void-void-justify-between">
						<span className="void-void-text-sm void-void-font-semibold">Response</span>
						{response &&
            <div className="void-void-flex void-void-items-center void-void-space-x-2 void-void-text-xs">
								<span className={`void-void-px-2 void-void-py-1 void-void-rounded ${
              response.status >= 200 && response.status < 300 ? "void-void-bg-green-600 void-void-text-white" :
              response.status >= 400 ? "void-void-bg-red-600 void-void-text-white" : "void-void-bg-yellow-600 void-void-text-white"}`}>
                
									{response.status} {response.statusText}
								</span>
								{response.responseTime &&
              <span className="void-void-text-[var(--vscode-descriptionForeground)]">{response.responseTime}ms</span>
              }
								{response.size &&
              <span className="void-void-text-[var(--vscode-descriptionForeground)]">{response.size}B</span>
              }
							</div>
            }
					</div>
					<div className="void-void-flex-1 void-void-p-3">
						{response ?
            <div className="void-void-space-y-4">
								{/* Response headers */}
								{response.headers && Object.keys(response.headers).length > 0 &&
              <div>
										<label className="void-void-block void-void-mb-2 void-void-text-sm void-void-font-medium">Response Headers</label>
										<div className="void-void-bg-[var(--vscode-input-background)] void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded void-void-p-3">
											{Object.entries(response.headers).map(([key, value]) =>
                  <div key={key} className="void-void-flex void-void-justify-between void-void-py-1 void-void-text-sm">
													<span className="void-void-font-medium">{key}:</span>
													<span className="void-void-text-[var(--vscode-descriptionForeground)]">{value}</span>
												</div>
                  )}
										</div>
									</div>
              }

								{/* Response body */}
								<div>
									<label className="void-void-block void-void-mb-2 void-void-text-sm void-void-font-medium">Response Body</label>
									<pre className="void-void-text-sm void-void-whitespace-pre-wrap void-void-font-mono void-void-bg-[var(--vscode-textCodeBlock-background)] void-void-border void-void-border-[var(--vscode-input-border)] void-void-rounded void-void-p-3">
										{response.body || 'No response body'}
									</pre>
								</div>
							</div> :

            <div className="void-void-flex void-void-items-center void-void-justify-center void-void-h-32">
								<div className="void-void-text-center void-void-text-[var(--vscode-descriptionForeground)]">
									<div className="void-void-text-4xl void-void-mb-2">⚡</div>
									<p>Click "Send" to execute the request</p>
								</div>
							</div>
            }
					</div>
				</div>
			</div>
		</div>);

};