/**
 * RequestEditor - Unified request/response editor component
 * Can be used in both side panel and main editor contexts
 */

import * as React from 'react';
import { ZapRequest } from '../../../../../../common/zapApiTypes.js';

interface RequestEditorProps {
  request: ZapRequest;
  collectionId?: string;
  context?: 'panel' | 'editor'; // Context determines layout
  onSendRequest?: (request: ZapRequest) => void;
  onToggleView?: () => void;
  response?: any;
  isLoading?: boolean;
}

export const RequestEditor: React.FC<RequestEditorProps> = ({
  request,
  collectionId,
  context = 'panel',
  onSendRequest,
  onToggleView,
  response,
  isLoading = false
}) => {
  const [activeView, setActiveView] = React.useState<'request-response' | 'bru'>('request-response');

  const handleSend = () => {
    if (onSendRequest) {
      onSendRequest(request);
    }
  };

  const handleToggleView = () => {
    if (context === 'editor') {
      setActiveView((prev) => prev === 'request-response' ? 'bru' : 'request-response');
    } else if (onToggleView) {
      onToggleView();
    }
  };

  // Generate BRU file content
  const generateBruContent = () => {
    const headers = request.headers || {};
    const headersSection = Object.keys(headers).length > 0 ?
    Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n') :
    '';

    return `meta {
  name: ${request.name}
  type: http
}

${request.method.toLowerCase()} {
  url: ${request.url || 'https://api.example.com/endpoint'}
}

${headersSection ? `headers {\n${headersSection}\n}\n` : ''}
${request.body ? `body:json {\n${typeof request.body === 'string' ? request.body : request.body.content || '{}'}\n}\n` : ''}

tests {
  test("should return 200", function() {
    expect(res.getStatus()).to.equal(200);
  });
}`;
  };

  // BRU view
  if (activeView === 'bru') {
    return (
      <div className="void-h-full void-bg-[var(--vscode-editor-background)] void-text-[var(--vscode-editor-foreground)] void-flex void-flex-col">
				{/* Header */}
				<div className="void-flex void-items-center void-justify-between void-p-3 void-border-b void-border-[var(--vscode-panel-border)]">
					<div className="void-flex void-items-center">
						<span className="void-mr-2">📝</span>
						<span className="void-text-sm void-font-semibold">{request.name}.bru</span>
					</div>
					<button
            className="void-px-3 void-py-1 void-text-xs void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)]"
            onClick={handleToggleView}>
            
						🔄 Back to Request
					</button>
				</div>

				{/* BRU content */}
				<div className="void-flex-1 void-p-4">
					<pre className="void-h-full void-bg-[var(--vscode-textCodeBlock-background)] void-text-[var(--vscode-editor-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-4 void-text-sm void-font-mono void-overflow-auto void-whitespace-pre-wrap">
						{generateBruContent()}
					</pre>
				</div>
			</div>);

  }

  // Request/Response view
  const isEditorContext = context === 'editor';

  return (
    <div className="void-h-full void-bg-[var(--vscode-editor-background)] void-text-[var(--vscode-editor-foreground)] void-flex void-flex-col">
			{/* Header */}
			<div className="void-flex void-items-center void-justify-between void-p-3 void-border-b void-border-[var(--vscode-panel-border)]">
				<div className="void-flex void-items-center void-space-x-2 void-flex-1">
					{isEditorContext &&
          <span className={`void-px-2 void-py-1 void-text-xs void-rounded void-text-white void-font-medium ${
          request.method === 'GET' ? "void-bg-green-600" :
          request.method === 'POST' ? "void-bg-blue-600" :
          request.method === 'PUT' ? "void-bg-yellow-600" :
          request.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"}`}>

            
							{request.method}
						</span>
          }

					{!isEditorContext &&
          <select
            className="void-px-2 void-py-1 void-text-sm void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded"
            value={request.method}
            disabled>
            
							<option>{request.method}</option>
						</select>
          }

					<input
            className="void-flex-1 void-px-3 void-py-1 void-text-sm void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded"
            value={request.url || ''}
            readOnly
            placeholder="Enter request URL" />
          

					<button
            className="void-px-4 void-py-1 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)] disabled:void-opacity-50"
            onClick={handleSend}
            disabled={isLoading}>
            
						{isLoading ? 'Sending...' : 'Send'}
					</button>
				</div>

				<button
          className="void-ml-2 void-px-2 void-py-1 void-text-xs void-bg-[var(--vscode-button-secondaryBackground)] void-text-[var(--vscode-button-secondaryForeground)] void-rounded hover:void-bg-[var(--vscode-button-secondaryHoverBackground)]"
          onClick={handleToggleView}
          title="View raw .bru file">
          
					📝
				</button>
			</div>

			{/* Content area */}
			<div className="void-flex-1 void-flex">
				{/* Request panel */}
				<div className="void-w-1/2 void-border-r void-border-[var(--vscode-panel-border)] void-flex void-flex-col">
					<div className="void-p-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
						<span className="void-text-sm void-font-semibold">Request</span>
					</div>
					<div className="void-flex-1 void-p-3 void-overflow-y-auto void-space-y-4">
						{/* Headers */}
						{request.headers && Object.keys(request.headers).length > 0 &&
            <div>
								<label className="void-block void-mb-2 void-text-sm void-font-medium">Headers</label>
								<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
									{Object.entries(request.headers).map(([key, value], index) =>
                <div key={index} className="void-flex void-mb-2 last:void-mb-0">
											<span className="void-w-1/3 void-text-sm void-pr-2 void-text-[var(--vscode-input-foreground)]">
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

						{/* Body */}
						<div>
							<label className="void-block void-mb-2 void-text-sm void-font-medium">Body</label>
							{request.body?.content ?
              <pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-[var(--vscode-textCodeBlock-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
									{request.body.content}
								</pre> :

              <div className="void-text-[var(--vscode-descriptionForeground)] void-text-sm void-p-3 void-border void-border-[var(--vscode-input-border)] void-rounded">
									No request body
								</div>
              }
						</div>
					</div>
				</div>

				{/* Response panel */}
				<div className="void-w-1/2 void-flex void-flex-col">
					<div className="void-p-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)] void-flex void-items-center void-justify-between">
						<span className="void-text-sm void-font-semibold">Response</span>
						{response &&
            <div className="void-flex void-items-center void-space-x-2 void-text-xs">
								<span className={`void-px-2 void-py-1 void-rounded ${
              response.status >= 200 && response.status < 300 ? "void-bg-green-600 void-text-white" :
              response.status >= 400 ? "void-bg-red-600 void-text-white" : "void-bg-yellow-600 void-text-white"}`}>

                
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
					<div className="void-flex-1 void-p-3">
						{response ?
            <pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-[var(--vscode-textCodeBlock-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
								{response.data ? JSON.stringify(response.data, null, 2) : response.body || response.error || 'No response body'}
							</pre> :

            <div className="void-flex void-items-center void-justify-center void-h-32">
								<div className="void-text-center void-text-[var(--vscode-descriptionForeground)]">
									<div className="void-text-4xl void-mb-2">⚡</div>
									<p>Click "Send" to execute the request</p>
								</div>
							</div>
            }
					</div>
				</div>
			</div>
		</div>);

};