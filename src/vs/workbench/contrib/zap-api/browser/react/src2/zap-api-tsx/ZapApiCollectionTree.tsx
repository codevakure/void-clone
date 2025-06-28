/**
 * ZapApiCollectionTree - Simple collection tree component for Zap API Testing
 * Uses Void Editor's Tailwind CSS theming
 */

import * as React from 'react';
import { useZapApi } from './ZapReactProvider.js';

export const ZapApiCollectionTree: React.FC = () => {
  const { state, actions } = useZapApi();

  return (
    <div className="void-void-h-full void-void-p-2">
			{state.collections.map((collection) =>
      <div key={collection.id} className="void-void-mb-2">
					{/* Collection Header */}
					<div
          className={`void-void-flex void-void-items-center void-void-p-2 void-void-rounded void-void-cursor-pointer void-hover:void-void-bg-[var(--vscode-list-hoverBackground)] ${
          state.activeCollection?.id === collection.id ? "void-void-bg-[var(--vscode-list-activeSelectionBackground)]" : ""}`}

          onClick={() => actions.setActiveCollection(collection)}>
          
						<span className="void-void-mr-2">📁</span>
						<span className="void-void-text-sm void-void-text-[var(--vscode-sideBar-foreground)]">{collection.name}</span>
					</div>

					{/* Collection Contents (shown when expanded) */}
					{state.activeCollection?.id === collection.id &&
        <div className="void-void-ml-4 void-void-mt-1">
							{/* Render folders */}
							{collection.folders.map((folder) =>
          <div key={folder.id} className="void-void-mb-1">
									<div className="void-void-flex void-void-items-center void-void-p-1 void-void-text-[var(--vscode-sideBar-foreground)]">
										<span className="void-void-mr-2">📂</span>
										<span className="void-void-text-sm">{folder.name}</span>
									</div>
									<div className="void-void-ml-4">
										{folder.requests.map((request) =>
              <div
                key={request.id}
                className="void-void-flex void-void-items-center void-void-p-2 void-void-rounded void-void-cursor-pointer void-hover:void-void-bg-[var(--vscode-list-hoverBackground)]"
                onClick={() => actions.openRequestAsEditor(request, collection.id)}>
                
												<span className={`void-void-mr-2 void-void-text-xs void-void-px-1 void-void-rounded void-void-text-white ${
                request.method === 'GET' ? "void-void-bg-green-600" :
                request.method === 'POST' ? "void-void-bg-blue-600" :
                request.method === 'PUT' ? "void-void-bg-yellow-600" :
                request.method === 'DELETE' ? "void-void-bg-red-600" : "void-void-bg-gray-600"}`}>

                  
													{request.method}
												</span>
												<span className="void-void-text-sm void-void-text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
											</div>
              )}
									</div>
								</div>
          )}

							{/* Render direct requests (not in folders) */}
							{collection.requests.map((request) =>
          <div
            key={request.id}
            className="void-void-flex void-void-items-center void-void-p-2 void-void-rounded void-void-cursor-pointer void-hover:void-void-bg-[var(--vscode-list-hoverBackground)]"
            onClick={() => actions.openRequestAsEditor(request, collection.id)}>
            
									<span className={`void-void-mr-2 void-void-text-xs void-void-px-1 void-void-rounded void-void-text-white ${
            request.method === 'GET' ? "void-void-bg-green-600" :
            request.method === 'POST' ? "void-void-bg-blue-600" :
            request.method === 'PUT' ? "void-void-bg-yellow-600" :
            request.method === 'DELETE' ? "void-void-bg-red-600" : "void-void-bg-gray-600"}`}>

              
										{request.method}
									</span>
									<span className="void-void-text-sm void-void-text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
								</div>
          )}
						</div>
        }
				</div>
      )}
		</div>);

};