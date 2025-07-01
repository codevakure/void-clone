/**
 * ZapApiCollectionTree - Collection tree component for browsing API collections
 * Used in the side panel to display and navigate collections
 */

import * as React from 'react';
import { useZapApi } from '../providers/ZapReactProvider.js';

export const ZapApiCollectionTree: React.FC = () => {
  const { state, actions } = useZapApi();

  return (
    <div className="void-h-full void-p-2">
			{state.collections.map((collection) =>
      <div key={collection.id} className="void-mb-2">
					{/* Collection Header */}
					<div
          className={`void-flex void-items-center void-p-2 void-rounded void-cursor-pointer hover:void-bg-[var(--vscode-list-hoverBackground)] ${
          state.activeCollection?.id === collection.id ? "void-bg-[var(--vscode-list-activeSelectionBackground)]" : ""}`}

          onClick={() => actions.setActiveCollection(collection)}>
          
						<span className="void-mr-2">📁</span>
						<span className="void-text-sm void-text-[var(--vscode-sideBar-foreground)]">{collection.name}</span>
					</div>

					{/* Collection Contents (shown when expanded) */}
					{state.activeCollection?.id === collection.id &&
        <div className="void-ml-4 void-mt-1">
							{/* Render folders */}
							{collection.folders.map((folder) =>
          <div key={folder.id} className="void-mb-1">
									<div className="void-flex void-items-center void-p-1 void-text-[var(--vscode-sideBar-foreground)]">
										<span className="void-mr-2">📂</span>
										<span className="void-text-sm">{folder.name}</span>
									</div>
									<div className="void-ml-4">
										{folder.requests.map((request) =>
              <div
                key={request.id}
                className="void-flex void-items-center void-p-2 void-rounded void-cursor-pointer hover:void-bg-[var(--vscode-list-hoverBackground)]"
                onClick={() => actions.openRequestAsEditor(request, collection.id)}>
                
												<span className={`void-mr-2 void-text-xs void-px-1 void-rounded void-text-white ${
                request.method === 'GET' ? "void-bg-green-600" :
                request.method === 'POST' ? "void-bg-blue-600" :
                request.method === 'PUT' ? "void-bg-yellow-600" :
                request.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"}`}>

                  
													{request.method}
												</span>
												<span className="void-text-sm void-text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
											</div>
              )}
									</div>
								</div>
          )}

							{/* Render direct requests (not in folders) */}
							{collection.requests.map((request) =>
          <div
            key={request.id}
            className="void-flex void-items-center void-p-2 void-rounded void-cursor-pointer hover:void-bg-[var(--vscode-list-hoverBackground)]"
            onClick={() => actions.openRequestAsEditor(request, collection.id)}>
            
									<span className={`void-mr-2 void-text-xs void-px-1 void-rounded void-text-white ${
            request.method === 'GET' ? "void-bg-green-600" :
            request.method === 'POST' ? "void-bg-blue-600" :
            request.method === 'PUT' ? "void-bg-yellow-600" :
            request.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"}`}>

              
										{request.method}
									</span>
									<span className="void-text-sm void-text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
								</div>
          )}
						</div>
        }
				</div>
      )}
		</div>);

};