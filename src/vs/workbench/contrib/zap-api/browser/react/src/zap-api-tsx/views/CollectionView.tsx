/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';
import { ZapCollection, ZapRequest } from '../../../../../common/zapApiTypes.js';

interface CollectionViewProps {
	collections?: ZapCollection[];
	onOpenRequest?: (request: ZapRequest, collectionId: string) => void;
}

/**
 * CollectionView - Side panel component for browsing collections and requests
 * Features:
 * - Tree view of collections and requests
 * - Click to open requests in main editor
 * - Create/import collection buttons
 */
export const CollectionView: React.FC<CollectionViewProps> = ({
	collections = [],
	onOpenRequest
}) => {
	const [expandedCollections, setExpandedCollections] = React.useState<Set<string>>(new Set());

	const toggleCollection = (collectionId: string) => {
		setExpandedCollections(prev => {
			const newSet = new Set(prev);
			if (newSet.has(collectionId)) {
				newSet.delete(collectionId);
			} else {
				newSet.add(collectionId);
			}
			return newSet;
		});
	};

	const handleOpenRequest = (request: ZapRequest, collectionId: string) => {
		if (onOpenRequest) {
			onOpenRequest(request, collectionId);
		}

		// Also dispatch custom event for VS Code integration
		const event = new CustomEvent('zap-api:open-request-editor', {
			detail: { request, collectionId }
		});
		window.dispatchEvent(event);
	};

	const mockCollections: ZapCollection[] = collections.length > 0 ? collections : [
		{
			id: 'sample-collection',
			name: 'Sample Collection',
			description: 'Sample API collection for testing',
			requests: [
				{
					id: 'get-users',
					name: 'Get Users',
					method: 'GET',
					url: 'https://jsonplaceholder.typicode.com/users',
					headers: { 'Accept': 'application/json' },
					body: { type: 'text', content: '' }
				},
				{
					id: 'create-user',
					name: 'Create User',
					method: 'POST',
					url: 'https://jsonplaceholder.typicode.com/users',
					headers: { 'Content-Type': 'application/json' },
					body: {
						type: 'json',
						content: JSON.stringify({
							name: 'John Doe',
							email: 'john@example.com'
						}, null, 2)
					}
				}
			],
			folders: [],
			environments: []
		}
	];

	return (
		<div className="void-h-full void-flex void-flex-col void-bg-[var(--vscode-sideBar-background)] void-text-[var(--vscode-sideBar-foreground)]">
			{/* Header */}
			<div className="void-p-4 void-border-b void-border-[var(--vscode-sideBar-border)]">
				<h2 className="void-text-lg void-font-semibold void-mb-2">Collections</h2>
				<div className="void-flex void-space-x-2">
					<button className="void-px-3 void-py-1 void-text-xs void-bg-[var(--vscode-button-background)] void-text-[var(--vscode-button-foreground)] void-rounded hover:void-bg-[var(--vscode-button-hoverBackground)]">
						+ New
					</button>
					<button className="void-px-3 void-py-1 void-text-xs void-bg-[var(--vscode-button-secondaryBackground)] void-text-[var(--vscode-button-secondaryForeground)] void-rounded hover:void-bg-[var(--vscode-button-secondaryHoverBackground)]">
						Import
					</button>
				</div>
			</div>

			{/* Collections Tree */}
			<div className="void-flex-1 void-overflow-y-auto">
				{mockCollections.map(collection => (
					<div key={collection.id} className="void-border-b void-border-[var(--vscode-sideBar-border)]">
						{/* Collection Header */}
						<div
							className="void-flex void-items-center void-p-3 void-cursor-pointer hover:void-bg-[var(--vscode-list-hoverBackground)]"
							onClick={() => toggleCollection(collection.id)}
						>
							<span className="void-mr-2 void-text-xs">
								{expandedCollections.has(collection.id) ? '▼' : '▶'}
							</span>
							<span className="void-font-medium">{collection.name}</span>
							<span className="void-ml-auto void-text-xs void-text-[var(--vscode-descriptionForeground)]">
								{collection.requests.length}
							</span>
						</div>

						{/* Collection Requests */}
						{expandedCollections.has(collection.id) && (
							<div className="void-ml-4">
								{collection.requests.map(request => (
									<div
										key={request.id}
										className="void-flex void-items-center void-p-2 void-pl-6 void-cursor-pointer hover:void-bg-[var(--vscode-list-hoverBackground)] void-border-l-2 void-border-transparent hover:void-border-[var(--vscode-focusBorder)]"
										onClick={() => handleOpenRequest(request, collection.id)}
									>
										<span className={`void-px-2 void-py-0.5 void-text-xs void-rounded void-text-white void-font-medium void-mr-3 ${
											request.method === 'GET' ? "void-bg-green-600" :
											request.method === 'POST' ? "void-bg-blue-600" :
											request.method === 'PUT' ? "void-bg-yellow-600" :
											request.method === 'DELETE' ? "void-bg-red-600" : "void-bg-gray-600"
										}`}>
											{request.method}
										</span>
										<span className="void-text-sm">{request.name}</span>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="void-p-3 void-border-t void-border-[var(--vscode-sideBar-border)] void-text-xs void-text-[var(--vscode-descriptionForeground)]">
				⚡ Click on requests to open them as editors
			</div>
		</div>
	);
};
