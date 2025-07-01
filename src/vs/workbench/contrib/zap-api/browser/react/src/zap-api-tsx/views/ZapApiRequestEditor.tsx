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
			await new Promise(resolve => setTimeout(resolve, 800));
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
		const headersSection = Object.keys(headers).length > 0
			? Object.entries(headers).map(([key, value]) => `${key}: ${value}`).join('\n')
			: '';

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
			<div className="h-full flex items-center justify-center bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)]">
				<div className="text-center text-[var(--vscode-descriptionForeground)]">
					<div className="mb-2 text-4xl">⚡</div>
					<div className="text-lg mb-2">No Request Selected</div>
					<div className="text-sm">Select a request from the collection tree to get started</div>
				</div>
			</div>
		);
	}

	if (activeView === 'zap-editor') {
		return (
			<div className="h-full flex flex-col bg-[var(--vscode-editor-background)]">
				{/* ZAP Header */}
				<div className="flex items-center justify-between p-4 border-b border-[var(--vscode-panel-border)]">
					<div className="flex items-center space-x-3">
						<span className="text-2xl">⚡</span>
						<div>
							<h1 className="text-lg font-semibold text-[var(--vscode-editor-foreground)]">
								{activeRequest.name}.zap
							</h1>
							<p className="text-sm text-[var(--vscode-descriptionForeground)]">
								Zap format file content
							</p>
						</div>
					</div>
					<button
						className="px-4 py-2 text-sm bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] rounded hover:bg-[var(--vscode-button-hoverBackground)]"
						onClick={() => actions.toggleCenterView()}
					>
						🔄 Back to Request/Response
					</button>
				</div>

				{/* ZAP Content */}
				<div className="flex-1 p-4">
					<pre className="h-full bg-[var(--vscode-textCodeBlock-background)] text-[var(--vscode-editor-foreground)] border border-[var(--vscode-input-border)] rounded p-4 text-sm font-mono overflow-auto whitespace-pre-wrap">
						{generateZapContent()}
					</pre>
				</div>
			</div>
		);
	}

	// Main Request/Response view
	return (
		<div className="h-full flex flex-col bg-[var(--vscode-editor-background)]">
			{/* Header with request info and controls */}
			<div className="flex items-center justify-between p-4 border-b border-[var(--vscode-panel-border)]">
				<div className="flex items-center space-x-3">
					<span className={`px-3 py-1 text-sm rounded text-white font-medium ${
						activeRequest.method === 'GET' ? 'bg-green-600' :
						activeRequest.method === 'POST' ? 'bg-blue-600' :
						activeRequest.method === 'PUT' ? 'bg-yellow-600' :
						activeRequest.method === 'DELETE' ? 'bg-red-600' :
						'bg-gray-600'
					}`}>
						{activeRequest.method}
					</span>
					<div>
						<h1 className="text-lg font-semibold text-[var(--vscode-editor-foreground)]">
							{activeRequest.name}
						</h1>
						<p className="text-sm text-[var(--vscode-descriptionForeground)]">
							{activeRequest.url}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<button
						className="px-3 py-2 text-sm bg-[var(--vscode-button-secondaryBackground)] text-[var(--vscode-button-secondaryForeground)] rounded hover:bg-[var(--vscode-button-secondaryHoverBackground)] border border-[var(--vscode-button-border)]"
						onClick={() => actions.toggleCenterView()}
					>
						⚡ View ZAP
					</button>
					<button
						className="px-6 py-2 text-sm bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] rounded hover:bg-[var(--vscode-button-hoverBackground)] disabled:opacity-50"
						onClick={sendRequest}
						disabled={isLoading}
					>
						{isLoading ? '⏳ Sending...' : '⚡ Send Request'}
					</button>
				</div>
			</div>

			{/* Request URL bar */}
			<div className="flex items-center space-x-2 p-4 border-b border-[var(--vscode-panel-border)] bg-[var(--vscode-editor-background)]">
				<select
					className="px-3 py-2 text-sm bg-[var(--vscode-input-background)] border border-[var(--vscode-input-border)] rounded"
					value={activeRequest.method}
					disabled
				>
					<option>{activeRequest.method}</option>
				</select>
				<input
					className="flex-1 px-3 py-2 text-sm bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] border border-[var(--vscode-input-border)] rounded"
					value={activeRequest.url || ''}
					readOnly
					placeholder="Request URL"
				/>
			</div>

			{/* Main content split view */}
			<div className="flex-1 flex">
				{/* Request panel */}
				<div className="w-1/2 flex flex-col border-r border-[var(--vscode-panel-border)]">
					<div className="p-3 border-b border-[var(--vscode-panel-border)] bg-[var(--vscode-tab-activeBackground)]">
						<h3 className="font-medium text-[var(--vscode-tab-activeForeground)]">Request</h3>
					</div>
					<div className="flex-1 p-4 overflow-y-auto">
						{/* Headers */}
						<div className="mb-6">
							<label className="block mb-2 text-sm font-medium text-[var(--vscode-editor-foreground)]">
								Headers
							</label>
							<div className="bg-[var(--vscode-input-background)] border border-[var(--vscode-input-border)] rounded p-3">
								{activeRequest.headers && Object.keys(activeRequest.headers).length > 0 ? (
									Object.entries(activeRequest.headers).map(([key, value], index) => (
										<div key={index} className="flex mb-2 last:mb-0">
											<span className="w-1/3 text-sm text-[var(--vscode-input-foreground)] pr-2 font-medium">
												{key}:
											</span>
											<span className="flex-1 text-sm text-[var(--vscode-input-foreground)]">
												{String(value)}
											</span>
										</div>
									))
								) : (
									<div className="text-sm text-[var(--vscode-descriptionForeground)]">
										No headers
									</div>
								)}
							</div>
						</div>

						{/* Body */}
						{activeRequest.body && (
							<div>
								<label className="block mb-2 text-sm font-medium text-[var(--vscode-editor-foreground)]">
									Body
								</label>
								<pre className="bg-[var(--vscode-textCodeBlock-background)] text-[var(--vscode-editor-foreground)] border border-[var(--vscode-input-border)] rounded p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
									{typeof activeRequest.body === 'string' ? activeRequest.body : activeRequest.body.content || '{}'}
								</pre>
							</div>
						)}
					</div>
				</div>

				{/* Response panel */}
				<div className="w-1/2 flex flex-col">
					<div className="p-3 border-b border-[var(--vscode-panel-border)] bg-[var(--vscode-tab-activeBackground)] flex items-center justify-between">
						<h3 className="font-medium text-[var(--vscode-tab-activeForeground)]">Response</h3>
						{response && (
							<div className="flex items-center space-x-2 text-xs">
								<span className={`px-2 py-1 rounded text-white font-medium ${
									response.status >= 200 && response.status < 300 ? 'bg-green-600' :
									response.status >= 400 ? 'bg-red-600' :
									'bg-yellow-600'
								}`}>
									{response.status} {response.statusText}
								</span>
								{response.responseTime && (
									<span className="text-[var(--vscode-descriptionForeground)]">{response.responseTime}ms</span>
								)}
								{response.size && (
									<span className="text-[var(--vscode-descriptionForeground)]">{response.size}B</span>
								)}
							</div>
						)}
					</div>
					<div className="flex-1 p-4 overflow-y-auto">
						{response ? (
							<>
								{/* Response headers */}
								{response.headers && (
									<div className="mb-6">
										<label className="block mb-2 text-sm font-medium text-[var(--vscode-editor-foreground)]">
											Headers
										</label>
										<div className="bg-[var(--vscode-input-background)] border border-[var(--vscode-input-border)] rounded p-3">
											{Object.entries(response.headers).map(([key, value], index) => (
												<div key={index} className="flex mb-2 last:mb-0">
													<span className="w-1/3 text-sm text-[var(--vscode-input-foreground)] pr-2 font-medium">
														{key}:
													</span>
													<span className="flex-1 text-sm text-[var(--vscode-input-foreground)]">
														{String(value)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Response body */}
								<div>
									<label className="block mb-2 text-sm font-medium text-[var(--vscode-editor-foreground)]">
										Body
									</label>
									<pre className="bg-[var(--vscode-textCodeBlock-background)] text-[var(--vscode-editor-foreground)] border border-[var(--vscode-input-border)] rounded p-3 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
										{response.body || 'No response body'}
									</pre>
								</div>
							</>
						) : (
							<div className="flex items-center justify-center h-full">
								<div className="text-center text-[var(--vscode-descriptionForeground)]">
									<div className="text-4xl mb-4">⚡</div>
									<p className="text-lg mb-2">Ready to Send</p>
									<p className="text-sm">Click the "Send Request" button to execute the request</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
