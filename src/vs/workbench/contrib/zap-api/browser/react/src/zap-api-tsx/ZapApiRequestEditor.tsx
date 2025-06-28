/**
 * ZapApiRequestEditor - Simple request/response editor for Zap API Testing
 * Uses Void Editor's Tailwind CSS theming
 */

import * as React from 'react';
import { useZapApi } from './ZapReactProvider.js';

export const ZapApiRequestEditor: React.FC = () => {
	const { state, actions } = useZapApi();
	const { activeRequest } = state;

	if (!activeRequest) {
		return (
			<div className="@@void-scope h-full">
				<div className="void-h-full void-flex void-items-center void-justify-center void-bg-vscode-editor-bg void-text-vscode-editor-fg">
					<div className="void-text-center void-text-vscode-disabledFg">
						<div className="void-mb-2">🔥</div>
						<div>Select a request to get started</div>
					</div>
				</div>
			</div>
		);
	}

	const response = state.responses.get(activeRequest.id);
	const isBruView = state.viewState.activeView === 'bru-editor';

	if (isBruView) {
		// .bru file editor view
		const bruContent = `meta {
  name: ${activeRequest.name}
  type: http
}

${activeRequest.method.toLowerCase()} {
  url: ${activeRequest.url}
}

${activeRequest.headers ? Object.entries(activeRequest.headers).map(([key, value]) =>
  `headers {\n  ${key}: ${value}\n}`
).join('\n\n') : ''}

${activeRequest.body?.content ? `body:json {
${activeRequest.body.content}
}` : ''}`;

		return (
			<div className="@@void-scope h-full">
				<div className="void-h-full void-bg-vscode-editor-bg void-text-vscode-editor-fg">
					{/* Header */}
					<div className="void-flex void-items-center void-justify-between void-p-3 void-border-b void-border-vscode-panel-border">
						<div className="void-flex void-items-center">
							<span className="void-mr-2">📝</span>
							<span className="void-text-sm void-font-semibold">View Raw .bru File</span>
						</div>
						<button
							className="void-px-3 void-py-1 void-text-xs void-bg-vscode-button-bg void-text-vscode-button-fg void-rounded void-hover:bg-vscode-button-hoverBg"
							onClick={() => actions.toggleCenterView()}
						>
							🔄 Back to Request
						</button>
					</div>

					{/* .bru content */}
					<div className="void-p-4 void-h-full void-overflow-auto">
						<pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-vscode-textCodeBlock-bg void-p-4 void-rounded">
							{bruContent}
						</pre>
					</div>
				</div>
			</div>
		);
	}

	// Request/Response view
	return (
		<div className="@@void-scope h-full">
			<div className="void-h-full void-bg-vscode-editor-bg void-text-vscode-editor-fg void-flex void-flex-col">
				{/* Header */}
				<div className="void-flex void-items-center void-justify-between void-p-3 void-border-b void-border-vscode-panel-border">
					<div className="void-flex void-items-center void-space-x-2">
						<select
							className="void-px-2 void-py-1 void-text-sm void-bg-vscode-input-bg void-border void-border-vscode-input-border void-rounded"
							value={activeRequest.method}
							disabled
						>
							<option>{activeRequest.method}</option>
						</select>
						<input
							className="void-flex-1 void-px-3 void-py-1 void-text-sm void-bg-vscode-input-bg void-border void-border-vscode-input-border void-rounded"
							value={activeRequest.url}
							readOnly
						/>
						<button
							className="void-px-4 void-py-1 void-text-sm void-bg-vscode-button-bg void-text-vscode-button-fg void-rounded void-hover:bg-vscode-button-hoverBg"
							onClick={() => actions.sendRequest(activeRequest)}
						>
							Send
						</button>
					</div>
					<button
						className="void-px-2 void-py-1 void-text-xs void-bg-vscode-button-secondary-bg void-text-vscode-button-secondary-fg void-rounded void-hover:bg-vscode-button-secondary-hoverBg"
						onClick={() => actions.toggleCenterView()}
						title="View raw .bru file"
					>
						📝
					</button>
				</div>

				{/* Body split view */}
				<div className="void-flex-1 void-flex">
					{/* Request panel */}
					<div className="void-w-1/2 void-border-r void-border-vscode-panel-border void-flex void-flex-col">
						<div className="void-p-2 void-border-b void-border-vscode-panel-border void-bg-vscode-tab-activeBackground">
							<span className="void-text-sm void-font-semibold">Request Body</span>
						</div>
						<div className="void-flex-1 void-p-3">
							{activeRequest.body?.content ? (
								<pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-vscode-textCodeBlock-bg void-p-3 void-rounded">
									{activeRequest.body.content}
								</pre>
							) : (
								<div className="void-text-vscode-disabledFg void-text-sm">No request body</div>
							)}
						</div>
					</div>

					{/* Response panel */}
					<div className="void-w-1/2 void-flex void-flex-col">
						<div className="void-p-2 void-border-b void-border-vscode-panel-border void-bg-vscode-tab-activeBackground void-flex void-items-center void-justify-between">
							<span className="void-text-sm void-font-semibold">Response Body</span>
							{response && (
								<div className="void-flex void-items-center void-space-x-2 void-text-xs">
									<span className={`void-px-2 void-py-1 void-rounded ${
										response.status >= 200 && response.status < 300 ? 'void-bg-green-600 void-text-white' :
										response.status >= 400 ? 'void-bg-red-600 void-text-white' :
										'void-bg-yellow-600 void-text-white'
									}`}>
										{response.status} {response.statusText}
									</span>
									<span className="void-text-vscode-disabledFg">{response.responseTime}ms</span>
									<span className="void-text-vscode-disabledFg">{response.size}B</span>
								</div>
							)}
						</div>
						<div className="void-flex-1 void-p-3">
							{response ? (
								<pre className="void-text-sm void-whitespace-pre-wrap void-font-mono void-bg-vscode-textCodeBlock-bg void-p-3 void-rounded">
									{response.body}
								</pre>
							) : (
								<div className="void-text-vscode-disabledFg void-text-sm">Click "Send" to see response</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
