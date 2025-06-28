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
      <div className="void-scope void-h-full">
				<div className="void-void-h-full void-void-flex void-void-items-center void-void-justify-center void-void-bg-vscode-editor-bg void-void-text-vscode-editor-fg">
					<div className="void-void-text-center void-void-text-vscode-disabledFg">
						<div className="void-void-mb-2">🔥</div>
						<div>Select a request to get started</div>
					</div>
				</div>
			</div>);

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
      <div className="void-scope void-h-full">
				<div className="void-void-h-full void-void-bg-vscode-editor-bg void-void-text-vscode-editor-fg">
					{/* Header */}
					<div className="void-void-flex void-void-items-center void-void-justify-between void-void-p-3 void-void-border-b void-void-border-vscode-panel-border">
						<div className="void-void-flex void-void-items-center">
							<span className="void-void-mr-2">📝</span>
							<span className="void-void-text-sm void-void-font-semibold">View Raw .bru File</span>
						</div>
						<button
              className="void-void-px-3 void-void-py-1 void-void-text-xs void-void-bg-vscode-button-bg void-void-text-vscode-button-fg void-void-rounded void-hover:void-bg-vscode-button-hoverBg"
              onClick={() => actions.toggleCenterView()}>
              
							🔄 Back to Request
						</button>
					</div>

					{/* .bru content */}
					<div className="void-void-p-4 void-void-h-full void-void-overflow-auto">
						<pre className="void-void-text-sm void-void-whitespace-pre-wrap void-void-font-mono void-void-bg-vscode-textCodeBlock-bg void-void-p-4 void-void-rounded">
							{bruContent}
						</pre>
					</div>
				</div>
			</div>);

  }

  // Request/Response view
  return (
    <div className="void-scope void-h-full">
			<div className="void-void-h-full void-void-bg-vscode-editor-bg void-void-text-vscode-editor-fg void-void-flex void-void-flex-col">
				{/* Header */}
				<div className="void-void-flex void-void-items-center void-void-justify-between void-void-p-3 void-void-border-b void-void-border-vscode-panel-border">
					<div className="void-void-flex void-void-items-center void-void-space-x-2">
						<select
              className="void-void-px-2 void-void-py-1 void-void-text-sm void-void-bg-vscode-input-bg void-void-border void-void-border-vscode-input-border void-void-rounded"
              value={activeRequest.method}
              disabled>
              
							<option>{activeRequest.method}</option>
						</select>
						<input
              className="void-void-flex-1 void-void-px-3 void-void-py-1 void-void-text-sm void-void-bg-vscode-input-bg void-void-border void-void-border-vscode-input-border void-void-rounded"
              value={activeRequest.url}
              readOnly />
            
						<button
              className="void-void-px-4 void-void-py-1 void-void-text-sm void-void-bg-vscode-button-bg void-void-text-vscode-button-fg void-void-rounded void-hover:void-bg-vscode-button-hoverBg"
              onClick={() => actions.sendRequest(activeRequest)}>
              
							Send
						</button>
					</div>
					<button
            className="void-void-px-2 void-void-py-1 void-void-text-xs void-void-bg-vscode-button-secondary-bg void-void-text-vscode-button-secondary-fg void-void-rounded void-hover:void-bg-vscode-button-secondary-hoverBg"
            onClick={() => actions.toggleCenterView()}
            title="View raw .bru file">
            
						📝
					</button>
				</div>

				{/* Body split view */}
				<div className="void-void-flex-1 void-void-flex">
					{/* Request panel */}
					<div className="void-void-w-1/2 void-void-border-r void-void-border-vscode-panel-border void-void-flex void-void-flex-col">
						<div className="void-void-p-2 void-void-border-b void-void-border-vscode-panel-border void-void-bg-vscode-tab-activeBackground">
							<span className="void-void-text-sm void-void-font-semibold">Request Body</span>
						</div>
						<div className="void-void-flex-1 void-void-p-3">
							{activeRequest.body?.content ?
              <pre className="void-void-text-sm void-void-whitespace-pre-wrap void-void-font-mono void-void-bg-vscode-textCodeBlock-bg void-void-p-3 void-void-rounded">
									{activeRequest.body.content}
								</pre> :

              <div className="void-void-text-vscode-disabledFg void-void-text-sm">No request body</div>
              }
						</div>
					</div>

					{/* Response panel */}
					<div className="void-void-w-1/2 void-void-flex void-void-flex-col">
						<div className="void-void-p-2 void-void-border-b void-void-border-vscode-panel-border void-void-bg-vscode-tab-activeBackground void-void-flex void-void-items-center void-void-justify-between">
							<span className="void-void-text-sm void-void-font-semibold">Response Body</span>
							{response &&
              <div className="void-void-flex void-void-items-center void-void-space-x-2 void-void-text-xs">
									<span className={`void-void-px-2 void-void-py-1 void-void-rounded ${
                response.status >= 200 && response.status < 300 ? "void-void-bg-green-600 void-void-text-white" :
                response.status >= 400 ? "void-void-bg-red-600 void-void-text-white" : "void-void-bg-yellow-600 void-void-text-white"}`}>

                  
										{response.status} {response.statusText}
									</span>
									<span className="void-void-text-vscode-disabledFg">{response.responseTime}ms</span>
									<span className="void-void-text-vscode-disabledFg">{response.size}B</span>
								</div>
              }
						</div>
						<div className="void-void-flex-1 void-void-p-3">
							{response ?
              <pre className="void-void-text-sm void-void-whitespace-pre-wrap void-void-font-mono void-void-bg-vscode-textCodeBlock-bg void-void-p-3 void-void-rounded">
									{response.body}
								</pre> :

              <div className="void-void-text-vscode-disabledFg void-void-text-sm">Click "Send" to see response</div>
              }
						</div>
					</div>
				</div>
			</div>
		</div>);

};