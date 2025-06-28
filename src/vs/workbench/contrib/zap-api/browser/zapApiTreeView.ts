/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ITreeViewDataProvider, ITreeItem, TreeItemCollapsibleState } from '../../../common/views.js';
import { ZapCollection, ZapFolder, ZapRequest } from '../common/zapApiTypes.js';
import { ZAP_API_COMMANDS } from '../common/zapApiConstants.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';

export class ZapApiTreeView extends Disposable implements ITreeViewDataProvider {

	private _collections: ZapCollection[] = [];

	constructor() {
		super();
		this.loadMockData();
	}

	// Mock data for demonstration
	private loadMockData(): void {
		this._collections = [
			{
				id: 'users-api',
				name: 'Users API',
				description: 'User management endpoints',
				folders: [
					{
						id: 'auth-folder',
						name: 'Authentication',
						requests: [
							{
								id: 'login-req',
								name: 'Login',
								method: 'POST',
								url: 'https://api.example.com/auth/login',
								headers: { 'Content-Type': 'application/json' },
								body: {
									type: 'json',
									content: '{\n  "email": "user@example.com",\n  "password": "password123"\n}'
								}
							}
						],
						subFolders: []
					}
				],
				requests: [
					{
						id: 'get-users',
						name: 'Get Users',
						method: 'GET',
						url: 'https://api.example.com/users',
						headers: { 'Authorization': 'Bearer {{token}}' }
					},
					{
						id: 'create-user',
						name: 'Create User',
						method: 'POST',
						url: 'https://api.example.com/users',
						headers: { 'Content-Type': 'application/json' },
						body: {
							type: 'json',
							content: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
						}
					}
				],
				environments: [
					{
						id: 'dev-env',
						name: 'Development',
						variables: { token: 'dev-token-123', baseUrl: 'https://dev-api.example.com' }
					}
				]
			}
		];
	}

	async getChildren(element?: any): Promise<any[]> {
		if (!element) {
			// Root level - return collections
			return this._collections.map(collection => ({
				type: 'collection',
				data: collection
			}));
		}

		if (element.type === 'collection') {
			const collection = element.data as ZapCollection;
			const children: any[] = [];

			// Add folders
			collection.folders.forEach(folder => {
				children.push({ type: 'folder', data: folder, parent: collection });
			});

			// Add root-level requests
			collection.requests.forEach(request => {
				children.push({ type: 'request', data: request, parent: collection });
			});

			return children;
		}

		if (element.type === 'folder') {
			const folder = element.data as ZapFolder;
			const children: any[] = [];

			// Add sub-folders
			folder.subFolders.forEach(subFolder => {
				children.push({ type: 'folder', data: subFolder, parent: folder });
			});

			// Add requests
			folder.requests.forEach(request => {
				children.push({ type: 'request', data: request, parent: folder });
			});

			return children;
		}

		return [];
	}

	async getTreeItem(element: any): Promise<ITreeItem> {
		if (element.type === 'collection') {
			const collection = element.data as ZapCollection;
			return {
				handle: collection.id,
				label: { label: collection.name },
				tooltip: collection.description,
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				themeIcon: ThemeIcon.fromId(Codicon.folder.id),
				contextValue: 'zapCollection',
				command: undefined
			};
		}

		if (element.type === 'folder') {
			const folder = element.data as ZapFolder;
			return {
				handle: folder.id,
				label: { label: folder.name },
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				themeIcon: ThemeIcon.fromId(Codicon.folderOpened.id),
				contextValue: 'zapFolder',
				command: undefined
			};
		}

		if (element.type === 'request') {
			const request = element.data as ZapRequest;
			return {
				handle: request.id,
				label: { label: `${request.method} ${request.name}` },
				tooltip: request.url,
				collapsibleState: TreeItemCollapsibleState.None,
				themeIcon: this.getMethodIcon(request.method),
				contextValue: 'zapRequest',
				command: {
					id: ZAP_API_COMMANDS.SHOW_REQUEST_RESPONSE,
					title: 'Open Request',
					arguments: [request]
				}
			};
		}

		return {
			handle: 'unknown',
			label: { label: 'Unknown' },
			collapsibleState: TreeItemCollapsibleState.None
		};
	}

	private getMethodIcon(method: string): ThemeIcon {
		switch (method.toUpperCase()) {
			case 'GET': return ThemeIcon.fromId(Codicon.arrowDown.id);
			case 'POST': return ThemeIcon.fromId(Codicon.add.id);
			case 'PUT': return ThemeIcon.fromId(Codicon.edit.id);
			case 'DELETE': return ThemeIcon.fromId(Codicon.trash.id);
			case 'PATCH': return ThemeIcon.fromId(Codicon.wrench.id);
			default: return ThemeIcon.fromId(Codicon.globe.id);
		}
	}

	async resolve?(element: any): Promise<ITreeItem | undefined> {
		return this.getTreeItem(element);
	}
}
