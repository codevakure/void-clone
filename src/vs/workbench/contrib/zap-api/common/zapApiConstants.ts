/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

export const ZAP_API_VIEW_ID = 'zapApiView';
export const ZAP_API_CONTAINER_ID = 'zapApiContainer';
export const ZAP_API_TREE_VIEW_ID = 'zapApiTreeView';

// Commands
export const ZAP_API_COMMANDS = {
	// Collection Management
	CREATE_COLLECTION: 'zapApi.createCollection',
	IMPORT_COLLECTION: 'zapApi.importCollection',
	DELETE_COLLECTION: 'zapApi.deleteCollection',

	// Request Management
	CREATE_REQUEST: 'zapApi.createRequest',
	DUPLICATE_REQUEST: 'zapApi.duplicateRequest',
	DELETE_REQUEST: 'zapApi.deleteRequest',
	SEND_REQUEST: 'zapApi.sendRequest',

	// View Management
	TOGGLE_VIEW: 'zapApi.toggleView',
	SHOW_REQUEST_RESPONSE: 'zapApi.showRequestResponse',
	SHOW_BRU_EDITOR: 'zapApi.showBruEditor',

	// Environment
	CREATE_ENVIRONMENT: 'zapApi.createEnvironment',
	SWITCH_ENVIRONMENT: 'zapApi.switchEnvironment',

	// Bot Integration
	GENERATE_TESTS: 'zapApi.generateTests',
	GENERATE_COLLECTION: 'zapApi.generateCollection',
	ANALYZE_API: 'zapApi.analyzeApi'
} as const;

// File Extensions
export const ZAP_FILE_EXTENSIONS = {
	BRU: '.bru',
	JSON: '.json'
} as const;

// HTTP Methods
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

// View Types
export const VIEW_TYPES = {
	REQUEST_RESPONSE: 'request-response',
	BRU_EDITOR: 'bru-editor'
} as const;
