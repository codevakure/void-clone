/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { useZapApi } from './providers/ZapReactProvider.js';
import { ZapApiCollectionTree } from './views/ZapApiCollectionTree.js';

/**
 * ZapApiMainApp - Side panel component that only shows the collection tree
 * This is used in the VS Code side panel to browse collections and open requests
 */
export const ZapApiMainApp: React.FC = () => {
  const { state, actions } = useZapApi();

  return (
    <div className="void-h-full void-flex void-flex-col void-bg-[var(--vscode-sideBar-background)] void-text-[var(--vscode-sideBar-foreground)]">
			{/* Header */}
			<div className="void-p-4 void-border-b void-border-[var(--vscode-sideBar-border)]">
				<h2 className="void-text-lg void-font-semibold void-text-[var(--vscode-sideBarTitle-foreground)]">
					API Collections
				</h2>
				<button
          className="void-mt-2 void-px-3 void-py-1 void-text-sm void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)]"
          onClick={() => {
            // TODO: Implement create new collection
            console.log('Create new collection');
          }}>
          
					+ New Collection
				</button>
			</div>

			{/* Collections Tree */}
			<div className="void-flex-1 void-overflow-auto">
				<ZapApiCollectionTree />
			</div>

			{/* Status/Info at bottom */}
			<div className="void-p-3 void-border-t void-border-[var(--vscode-sideBar-border)] void-text-xs void-text-[var(--vscode-descriptionForeground)]">
				⚡ Click on requests to open them as editors
			</div>
		</div>);

};