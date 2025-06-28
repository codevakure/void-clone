/**
 * ZapApiRequestEditorMain - Individual request editor component that shows in the main editor area
 * This replaces the previous inline editor when a request is opened as a tab
 */

import * as React from 'react';
import { ZapRequest } from '../../../../common/zapApiTypes.js';

interface ZapApiRequestEditorMainProps {
	request: ZapRequest;
	collectionId: string;
}

export const ZapApiRequestEditorMain: React.FC<ZapApiRequestEditorMainProps> = ({ request, collectionId }) => {
	const [activeView, setActiveView] = React.useState<'request-response' | 'code'>('request-response');
	const [response, setResponse] = React.useState<any>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	// Listen for toggle events from the tab bar button
	React.useEffect(() => {
		const handleToggle = (event: CustomEvent) => {
			// Toggle the view when the tab bar button is clicked
			setActiveView(prev => prev === 'request-response' ? 'code' : 'request-response');
		};

		window.addEventListener('zap-api:toggle-view', handleToggle as EventListener);

		return () => {
			window.removeEventListener('zap-api:toggle-view', handleToggle as EventListener);
		};
	}, []);

	// Mock send request function
	const sendRequest = async () => {
		setIsLoading(true);
		try {
			// Mock API call - in real implementation this would use actual HTTP client
			await new Promise(resolve => setTimeout(resolve, 1000));
			setResponse({
				status: 200,
				statusText: 'OK',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': '156'
				},
				data: {
					message: 'Success',
					timestamp: new Date().toISOString(),
					data: { id: 1, name: 'Sample Response' }
				}
			});
		} catch (error) {
			setResponse({
				status: 500,
				statusText: 'Internal Server Error',
				error: 'Failed to send request'
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Generate BRU file content
	const generateBruContent = () => {
		const headers = request.headers || {};
		const headersSection = Object.keys(headers).length > 0
			? Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n')
			: '';

		return `meta {
  name: ${request.name}
  type: http
  seq: 1
}

${request.method.toLowerCase()} {
  url: ${request.url || 'https://api.example.com/endpoint'}
  body: ${request.body ? 'json' : 'none'}
  auth: none
}

${headersSection ? `headers {\n${headersSection}\n}\n` : ''}
${request.body ? `body:json {\n${typeof request.body === 'string' ? request.body : JSON.stringify(JSON.parse(request.body.content || '{}'), null, 2)}\n}\n` : ''}

tests {
  test("should return 200", function() {
    expect(res.getStatus()).to.equal(200);
  });
}`;
	};

	return (
		<div className="void-h-full void-flex void-flex-col void-bg-[var(--vscode-editor-background)]">
			{/* Header with request info and controls */}
			<div className="void-flex void-items-center void-justify-between void-p-4 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-editor-background)]">
				<div className="void-flex void-items-center void-space-x-3">
					<span className={`void-px-2 void-py-1 void-text-xs void-rounded void-text-white void-font-medium ${
						request.method === 'GET' ? 'void-bg-green-600' :
						request.method === 'POST' ? 'void-bg-blue-600' :
						request.method === 'PUT' ? 'void-bg-yellow-600' :
						request.method === 'DELETE' ? 'void-bg-red-600' :
						'void-bg-gray-600'
					}`}>
						{request.method}
					</span>
					<h1 className="void-text-lg void-font-semibold void-text-[var(--vscode-editor-foreground)]">
						{request.name}
					</h1>
				</div>
				<div className="void-flex void-items-center void-space-x-2">
					<button
						className="void-px-3 void-py-1 void-text-sm void-bg-[var(--vscode-button-secondaryBackground)] void-text-[var(--vscode-button-secondaryForeground)] void-rounded void-hover:void-bg-[var(--vscode-button-secondaryHoverBackground)] void-border void-border-[var(--vscode-button-border)]"
						onClick={() => setActiveView(activeView === 'request-response' ? 'code' : 'request-response')}
					>
						{activeView === 'request-response' ? 'Show BRU Code' : 'Show Request/Response'}
					</button>
					<button
						className="void-px-4 void-py-1 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded void-hover:void-bg-[var(--vscode-button-hoverBackground)] void-disabled:void-opacity-50"
						onClick={sendRequest}
						disabled={isLoading}
					>
						{isLoading ? 'Sending...' : 'Send'}
					</button>
				</div>
			</div>

			{/* Main content area */}
			<div className="void-flex-1 void-overflow-hidden">
				{activeView === 'request-response' ? (
					<div className="void-h-full void-flex">
						{/* Request panel */}
						<div className="void-w-1/2 void-flex void-flex-col void-border-r void-border-[var(--vscode-panel-border)]">
							<div className="void-px-4 void-py-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
								<h3 className="void-font-medium void-text-[var(--vscode-tab-activeForeground)]">Request</h3>
							</div>
							<div className="void-flex-1 void-p-4 void-overflow-y-auto">
								{/* URL */}
								<div className="void-mb-4">
									<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
										URL
									</label>
									<input
										type="text"
										value={request.url || ''}
										readOnly
										className="void-w-full void-px-3 void-py-2 void-bg-[var(--vscode-input-background)] void-text-[var(--vscode-input-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded"
									/>
								</div>

								{/* Headers */}
								<div className="void-mb-4">
									<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
										Headers
									</label>
									<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
										{request.headers && Object.keys(request.headers).length > 0 ? (
											Object.entries(request.headers).map(([key, value], index) => (
												<div key={index} className="void-flex void-mb-2 last:void-mb-0">
													<span className="void-w-1/3 void-text-sm void-text-[var(--vscode-input-foreground)] void-pr-2">
														{key}:
													</span>
													<span className="void-flex-1 void-text-sm void-text-[var(--vscode-input-foreground)]">
														{String(value)}
													</span>
												</div>
											))
										) : (
											<div className="void-text-sm void-text-[var(--vscode-descriptionForeground)]">
												No headers
											</div>
										)}
									</div>
								</div>

								{/* Body */}
								{request.body && (
									<div className="void-mb-4">
										<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
											Body
										</label>								<textarea
									value={request.body ? (typeof request.body === 'string' ? request.body : request.body.content) : ''}
									readOnly
									rows={8}
									className="void-w-full void-px-3 void-py-2 void-bg-[var(--vscode-input-background)] void-text-[var(--vscode-input-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-font-mono void-text-sm"
								/>
									</div>
								)}
							</div>
						</div>

						{/* Response panel */}
						<div className="void-w-1/2 void-flex void-flex-col">
							<div className="void-px-4 void-py-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
								<h3 className="void-font-medium void-text-[var(--vscode-tab-activeForeground)]">Response</h3>
							</div>
							<div className="void-flex-1 void-p-4 void-overflow-y-auto">
								{response ? (
									<>
										{/* Status */}
										<div className="void-mb-4">
											<div className="void-flex void-items-center void-space-x-2">
												<span className={`void-px-2 void-py-1 void-text-xs void-rounded void-text-white void-font-medium ${
													response.status >= 200 && response.status < 300 ? 'void-bg-green-600' :
													response.status >= 400 ? 'void-bg-red-600' :
													'void-bg-yellow-600'
												}`}>
													{response.status}
												</span>
												<span className="void-text-sm void-text-[var(--vscode-editor-foreground)]">
													{response.statusText}
												</span>
											</div>
										</div>

										{/* Response headers */}
										{response.headers && (
											<div className="void-mb-4">
												<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
													Headers
												</label>
												<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
													{Object.entries(response.headers).map(([key, value], index) => (
														<div key={index} className="void-flex void-mb-2 last:void-mb-0">
															<span className="void-w-1/3 void-text-sm void-text-[var(--vscode-input-foreground)] void-pr-2">
																{key}:
															</span>
															<span className="void-flex-1 void-text-sm void-text-[var(--vscode-input-foreground)]">
																{String(value)}
															</span>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Response body */}
										<div className="void-mb-4">
											<label className="void-block void-mb-2 void-text-sm void-font-medium void-text-[var(--vscode-editor-foreground)]">
												Body
											</label>
											<pre className="void-bg-[var(--vscode-input-background)] void-text-[var(--vscode-input-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3 void-text-sm void-overflow-x-auto void-whitespace-pre-wrap">
												{response.data ? JSON.stringify(response.data, null, 2) : response.error || 'No response body'}
											</pre>
										</div>
									</>
								) : (
									<div className="void-flex void-items-center void-justify-center void-h-32">
										<div className="void-text-center void-text-[var(--vscode-descriptionForeground)]">
											<div className="void-text-4xl void-mb-2">⚡</div>
											<p>Click "Send" to execute the request</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					/* BRU Code view */
					<div className="void-h-full void-flex void-flex-col">
						<div className="void-px-4 void-py-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
							<h3 className="void-font-medium void-text-[var(--vscode-tab-activeForeground)]">{request.name}.bru</h3>
						</div>
						<div className="void-flex-1 void-p-4">
							<pre className="void-h-full void-bg-[var(--vscode-editor-background)] void-text-[var(--vscode-editor-foreground)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-4 void-text-sm void-font-mono void-overflow-auto void-whitespace-pre-wrap">
								{generateBruContent()}
							</pre>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
