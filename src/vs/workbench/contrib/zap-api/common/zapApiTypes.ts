/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

export interface ZapCollection {
	id: string;
	name: string;
	description?: string;
	folders: ZapFolder[];
	requests: ZapRequest[];
	environments: ZapEnvironment[];
}

export interface ZapFolder {
	id: string;
	name: string;
	requests: ZapRequest[];
	subFolders: ZapFolder[];
}

export interface ZapRequest {
	id: string;
	name: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	url: string;
	headers: Record<string, string>;
	body?: {
		type: 'json' | 'text' | 'form' | 'multipart';
		content: string;
	};
	tests?: string[];
	auth?: {
		type: 'bearer' | 'basic' | 'apikey';
		token?: string;
		username?: string;
		password?: string;
	};
}

export interface ZapResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	responseTime: number;
	size: number;
}

export interface ZapEnvironment {
	id: string;
	name: string;
	variables: Record<string, string>;
}

export interface BruFile {
	filePath: string;
	content: string;
	parsed: ZapRequest;
}

export interface ZapApiViewState {
	selectedCollection?: string;
	selectedRequest?: string;
	activeView: 'request-response' | 'zap-editor';
	splitView: {
		requestBodyVisible: boolean;
		responseBodyVisible: boolean;
	};
}
