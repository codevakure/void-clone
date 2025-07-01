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
		<div className="void-h-full void-bg-[var(--vscode-editor-background)] void-text-[var(--vscode-editor-foreground)] void-flex void-flex-col">
			{/* Header with controls */}
			<div className="void-flex void-items-center void-justify-between void-p-3 void-border-b void-border-[var(--vscode-panel-border)]">
				<div className="void-flex void-items-center void-space-x-2">
					<span className={`void-px-2 void-py-1 void-text-xs void-rounded void-text-white void-font-medium ${
						request.method === 'GET' ? "void-bg-green-600" :
						request.method === 'POST' ? "void-bg-blue-600" :
						request.method === 'PUT' ? "void-bg-yellow-600" :
						request.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"
					}`}>
						{request.method}
					</span>
					<span className="void-text-sm void-font-medium">{request.name}</span>
				</div>

				<div className="void-flex void-items-center void-space-x-2">
					<button
						className="void-px-4 void-py-1 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)] disabled:void-opacity-50"
						onClick={handleSendRequest}
						disabled={isLoading}
					>
						{isLoading ? 'Sending...' : 'Send'}
					</button>
				</div>
			</div>

			{/* Content area - split panels */}
			<div className="void-flex-1 void-flex">
				{/* Request panel */}
				<div className="void-w-1/2 void-border-r void-border-[var(--vscode-panel-border)] void-flex void-flex-col">
					<div className="void-p-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)]">
						<span className="void-text-sm void-font-semibold">Request</span>
					</div>
					<div className="void-flex-1 void-p-3 void-overflow-y-auto void-space-y-4">
						{/* URL */}
						<div>
							<label className="void-block void-mb-2 void-text-sm void-font-medium">URL</label>
							<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3 void-text-sm void-font-mono">
								{request.url || 'No URL specified'}
							</div>
						</div>

						{/* Headers */}
						{request.headers && Object.keys(request.headers).length > 0 && (
							<div>
								<label className="void-block void-mb-2 void-text-sm void-font-medium">Headers</label>
								<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
									{Object.entries(request.headers).map(([key, value]) => (
										<div key={key} className="void-flex void-justify-between void-py-1 void-text-sm">
											<span className="void-font-medium">{key}:</span>
											<span className="void-text-[var(--vscode-descriptionForeground)]">{value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Body */}
						{request.body && request.body.content && (
							<div>
								<label className="void-block void-mb-2 void-text-sm void-font-medium">Body</label>
								<pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-[var(--vscode-textCodeBlock-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
									{request.body.content}
								</pre>
							</div>
						)}

						{(!request.body || !request.body.content) && (
							<div className="void-text-[var(--vscode-descriptionForeground)] void-text-sm void-p-3 void-border void-border-[var(--vscode-input-border)] void-rounded">
								No request body
							</div>
						)}
					</div>
				</div>

				{/* Response panel */}
				<div className="void-w-1/2 void-flex void-flex-col">
					<div className="void-p-2 void-border-b void-border-[var(--vscode-panel-border)] void-bg-[var(--vscode-tab-activeBackground)] void-flex void-items-center void-justify-between">
						<span className="void-text-sm void-font-semibold">Response</span>
						{response && (
							<div className="void-flex void-items-center void-space-x-2 void-text-xs">
								<span className={`void-px-2 void-py-1 void-rounded ${
									response.status >= 200 && response.status < 300 ? "void-bg-green-600 void-text-white" :
									response.status >= 400 ? "void-bg-red-600 void-text-white" : "void-bg-yellow-600 void-text-white"
								}`}>
									{response.status} {response.statusText}
								</span>
								{response.responseTime && (
									<span className="void-text-[var(--vscode-descriptionForeground)]">{response.responseTime}ms</span>
								)}
								{response.size && (
									<span className="void-text-[var(--vscode-descriptionForeground)]">{response.size}B</span>
								)}
							</div>
						)}
					</div>
					<div className="void-flex-1 void-p-3">
						{response ? (
							<div className="void-space-y-4">
								{/* Response headers */}
								{response.headers && Object.keys(response.headers).length > 0 && (
									<div>
										<label className="void-block void-mb-2 void-text-sm void-font-medium">Response Headers</label>
										<div className="void-bg-[var(--vscode-input-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
											{Object.entries(response.headers).map(([key, value]) => (
												<div key={key} className="void-flex void-justify-between void-py-1 void-text-sm">
													<span className="void-font-medium">{key}:</span>
													<span className="void-text-[var(--vscode-descriptionForeground)]">{value}</span>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Response body */}
								<div>
									<label className="void-block void-mb-2 void-text-sm void-font-medium">Response Body</label>
									<pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-[var(--vscode-textCodeBlock-background)] void-border void-border-[var(--vscode-input-border)] void-rounded void-p-3">
										{response.body || 'No response body'}
									</pre>
								</div>
							</div>
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
		</div>
	);
};
