/**
 * ZapApiCollectionTree - Collection tree component for browsing API collections
 * Used in the side panel to display and navigate collections
 */

import * as React from 'react';
import { useZapApi } from '../providers/ZapReactProvider.js';

export const ZapApiCollectionTree: React.FC = () => {
	const { state, actions } = useZapApi();

	return (
		<div className="h-full p-2">
			{state.collections.map(collection => (
				<div key={collection.id} className="mb-2">
					{/* Collection Header */}
					<div
						className={`flex items-center p-2 rounded cursor-pointer hover:bg-[var(--vscode-list-hoverBackground)] ${
							state.activeCollection?.id === collection.id ? 'bg-[var(--vscode-list-activeSelectionBackground)]' : ''
						}`}
						onClick={() => actions.setActiveCollection(collection)}
					>
						<span className="mr-2">📁</span>
						<span className="text-sm text-[var(--vscode-sideBar-foreground)]">{collection.name}</span>
					</div>

					{/* Collection Contents (shown when expanded) */}
					{state.activeCollection?.id === collection.id && (
						<div className="ml-4 mt-1">
							{/* Render folders */}
							{collection.folders.map(folder => (
								<div key={folder.id} className="mb-1">
									<div className="flex items-center p-1 text-[var(--vscode-sideBar-foreground)]">
										<span className="mr-2">📂</span>
										<span className="text-sm">{folder.name}</span>
									</div>
									<div className="ml-4">
										{folder.requests.map(request => (
											<div
												key={request.id}
												className="flex items-center p-2 rounded cursor-pointer hover:bg-[var(--vscode-list-hoverBackground)]"
												onClick={() => actions.openRequestAsEditor(request, collection.id)}
											>
												<span className={`mr-2 text-xs px-1 rounded text-white ${
													request.method === 'GET' ? 'bg-green-600' :
													request.method === 'POST' ? 'bg-blue-600' :
													request.method === 'PUT' ? 'bg-yellow-600' :
													request.method === 'DELETE' ? 'bg-red-600' :
													'bg-gray-600'
												}`}>
													{request.method}
												</span>
												<span className="text-sm text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
											</div>
										))}
									</div>
								</div>
							))}

							{/* Render direct requests (not in folders) */}
							{collection.requests.map(request => (
								<div
									key={request.id}
									className="flex items-center p-2 rounded cursor-pointer hover:bg-[var(--vscode-list-hoverBackground)]"
									onClick={() => actions.openRequestAsEditor(request, collection.id)}
								>
									<span className={`mr-2 text-xs px-1 rounded text-white ${
										request.method === 'GET' ? 'bg-green-600' :
										request.method === 'POST' ? 'bg-blue-600' :
										request.method === 'PUT' ? 'bg-yellow-600' :
										request.method === 'DELETE' ? 'bg-red-600' :
										'bg-gray-600'
									}`}>
										{request.method}
									</span>
									<span className="text-sm text-[var(--vscode-sideBar-foreground)]">{request.name}</span>
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};
