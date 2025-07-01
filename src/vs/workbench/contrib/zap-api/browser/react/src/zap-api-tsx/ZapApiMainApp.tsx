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
		<div className="h-full flex flex-col bg-[var(--vscode-sideBar-background)] text-[var(--vscode-sideBar-foreground)]">
			{/* Header */}
			<div className="p-4 border-b border-[var(--vscode-sideBar-border)]">
				<h2 className="text-lg font-semibold text-[var(--vscode-sideBarTitle-foreground)]">
					API Collections
				</h2>
				<button
					className="mt-2 px-3 py-1 text-sm bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] rounded hover:bg-[var(--vscode-button-hoverBackground)]"
					onClick={() => {
						// TODO: Implement create new collection
						console.log('Create new collection');
					}}
				>
					+ New Collection
				</button>
			</div>

			{/* Collections Tree */}
			<div className="flex-1 overflow-auto">
				<ZapApiCollectionTree />
			</div>

			{/* Status/Info at bottom */}
			<div className="p-3 border-t border-[var(--vscode-sideBar-border)] text-xs text-[var(--vscode-descriptionForeground)]">
				⚡ Click on requests to open them as editors
			</div>
		</div>
	);
};
