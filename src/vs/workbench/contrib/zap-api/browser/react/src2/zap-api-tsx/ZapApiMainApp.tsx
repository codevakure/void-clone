/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { useZapApi } from './ZapReactProvider.js';
import { ZapApiCollectionTree } from './ZapApiCollectionTree.js';
import { ZapApiRequestEditor } from './ZapApiRequestEditor.js';

export const ZapApiMainApp: React.FC = () => {
  const { state, actions } = useZapApi();

  return (
    <div className="void-void-h-full void-void-flex void-void-flex-col void-void-bg-[var(--vscode-sideBar-background)] void-void-text-[var(--vscode-sideBar-foreground)]">
			{/* Header */}
			<div className="void-void-p-4 void-void-border-b void-void-border-[var(--vscode-sideBar-border)]">
				<h2 className="void-void-text-lg void-void-font-semibold void-void-text-[var(--vscode-sideBarTitle-foreground)]">
					Collections
				</h2>
				<button
          className="void-void-mt-2 void-void-px-3 void-void-py-1 void-void-text-sm void-void-bg-[var(--vscode-button-background)] void-void-text-[var(--vscode-button-foreground)] void-void-rounded void-hover:void-void-bg-[var(--vscode-button-hoverBackground)]"
          onClick={() => {
            // Mock: Create new collection
            console.log('Create new collection');
          }}>
          
					+ New Collection
				</button>
			</div>

			{/* Collections Tree */}
			<div className="void-void-flex-1 void-void-overflow-auto">
				<ZapApiCollectionTree />
			</div>

			{/* Status/Info at bottom */}
			<div className="void-void-p-3 void-void-border-t void-void-border-[var(--vscode-sideBar-border)] void-void-text-xs void-void-text-[var(--vscode-descriptionForeground)]">
				⚡ Click on requests to open them as editors
			</div>
		</div>);

};