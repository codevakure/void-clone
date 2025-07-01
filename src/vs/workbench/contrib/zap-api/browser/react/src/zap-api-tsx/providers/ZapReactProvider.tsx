/**
 * ZapReactProvider - Simple React Provider for Zap API Testing Panel
 * Uses Void Editor's theming approach with Tailwind CSS and CSS variables.
 */

import * as React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { ZapCollection, ZapRequest, ZapResponse, ZapEnvironment, ZapApiViewState } from '../../../../../../zap-api/common/zapApiTypes.js';

export interface ZapApiState {
	collections: ZapCollection[];
	activeCollection: ZapCollection | null;
	activeRequest: ZapRequest | null;
	environments: ZapEnvironment[];
	activeEnvironment: ZapEnvironment | null;
	viewState: ZapApiViewState;
	responses: Map<string, ZapResponse>;
}

export interface ZapApiActions {
	setActiveCollection: (collection: ZapCollection | null) => void;
	setActiveRequest: (request: ZapRequest | null) => void;
	openRequestAsEditor: (request: ZapRequest, collectionId: string) => void;
	sendRequest: (request: ZapRequest) => void;
	toggleCenterView: () => void;
}

export interface ZapApiContext {
	state: ZapApiState;
	actions: ZapApiActions;
}

const ZapApiReactContext = createContext<ZapApiContext | null>(null);

export interface ZapReactProviderProps {
	children?: ReactNode;
}

// Mock data for testing
const mockCollections: ZapCollection[] = [
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

export const ZapReactProvider: React.FC<ZapReactProviderProps> = ({ children }) => {
	const [state, setState] = useState<ZapApiState>({
		collections: mockCollections,
		activeCollection: null,
		activeRequest: null,
		environments: mockCollections[0].environments,
		activeEnvironment: mockCollections[0].environments[0],
		viewState: {
			activeView: 'request-response',
			splitView: { requestBodyVisible: true, responseBodyVisible: true }
		},
		responses: new Map()
	});

	// Listen for toggle events from VS Code commands
	React.useEffect(() => {
		const handleToggle = (event: CustomEvent) => {
			setState(prev => ({
				...prev,
				viewState: {
					...prev.viewState,
					activeView: prev.viewState.activeView === 'request-response' ? 'zap-editor' : 'request-response'
				}
			}));
		};

		window.addEventListener('zap-api:toggle-view', handleToggle as EventListener);
		return () => {
			window.removeEventListener('zap-api:toggle-view', handleToggle as EventListener);
		};
	}, []);

	const actions: ZapApiActions = {
		setActiveCollection: (collection) => {
			setState(prev => ({
				...prev,
				activeCollection: collection,
				activeRequest: collection ? collection.requests[0] || null : null
			}));
		},

		setActiveRequest: (request) => {
			setState(prev => ({ ...prev, activeRequest: request }));
		},

		openRequestAsEditor: (request, collectionId) => {
			// This will be handled by the Zap API pane via a global mechanism
			// We'll dispatch a custom event that the pane can listen to
			const event = new CustomEvent('zap-api:open-request-editor', {
				detail: { request, collectionId }
			});
			window.dispatchEvent(event);
		},

		sendRequest: (request) => {
			// Mock response
			const mockResponse: ZapResponse = {
				status: 200,
				statusText: 'OK',
				headers: { 'Content-Type': 'application/json' },
				body: '{\n  "message": "Mock response",\n  "data": []\n}',
				size: 45,
				responseTime: 123
			};

			setState(prev => {
				const newResponses = new Map(prev.responses);
				newResponses.set(request.id, mockResponse);
				return { ...prev, responses: newResponses };
			});
		},

		toggleCenterView: () => {
			setState(prev => ({
				...prev,
				viewState: {
					...prev.viewState,
					activeView: prev.viewState.activeView === 'request-response' ? 'zap-editor' : 'request-response'
				}
			}));
		}
	};

	const contextValue: ZapApiContext = {
		state,
		actions
	};

	return (
		<ZapApiReactContext.Provider value={contextValue}>
			{children}
		</ZapApiReactContext.Provider>
	);
};

export const useZapApi = (): ZapApiContext => {
	const context = useContext(ZapApiReactContext);
	if (!context) {
		throw new Error('useZapApi must be used within a ZapReactProvider');
	}
	return context;
};
