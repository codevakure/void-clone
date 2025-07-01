/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { ZapRequest } from './zapApiTypes.js';

export class ZapParser {

	/**
	 * Parse a .zap file content into a ZapRequest object
	 */
	static parseZapFile(content: string): ZapRequest {
		const lines = content.split('\n');
		const request: Partial<ZapRequest> = {
			id: this.generateId(),
			headers: {},
			tests: []
		};

		let currentSection = '';
		let bodyContent = '';

		for (const line of lines) {
			const trimmed = line.trim();

			// Parse sections
			if (trimmed.startsWith('meta {')) {
				currentSection = 'meta';
				continue;
			} else if (trimmed.match(/^(get|post|put|delete|patch|head|options) \{/i)) {
				currentSection = 'http';
				request.method = trimmed.split(' ')[0].toUpperCase() as any;
				continue;
			} else if (trimmed.startsWith('headers {')) {
				currentSection = 'headers';
				continue;
			} else if (trimmed.startsWith('body {')) {
				currentSection = 'body';
				continue;
			} else if (trimmed.startsWith('tests {')) {
				currentSection = 'tests';
				continue;
			} else if (trimmed === '}') {
				currentSection = '';
				continue;
			}

			// Parse content based on current section
			switch (currentSection) {
				case 'meta':
					if (trimmed.startsWith('name:')) {
						request.name = trimmed.substring(5).trim();
					}
					break;
				case 'http':
					if (trimmed.startsWith('url:')) {
						request.url = trimmed.substring(4).trim();
					}
					break;
				case 'headers':
					const headerMatch = trimmed.match(/^(.+?):\s*(.+)$/);
					if (headerMatch && request.headers) {
						request.headers[headerMatch[1]] = headerMatch[2];
					}
					break;
				case 'body':
					bodyContent += line + '\n';
					break;
				case 'tests':
					if (trimmed && request.tests) {
						request.tests.push(trimmed);
					}
					break;
			}
		}

		// Set body if exists
		if (bodyContent.trim()) {
			request.body = {
				type: 'json', // Default to JSON, could be improved with content detection
				content: bodyContent.trim()
			};
		}

		return request as ZapRequest;
	}

	/**
	 * Convert a ZapRequest object back to .bru file format
	 */
	static requestToBruFile(request: ZapRequest): string {
		let content = '';

		// Meta section
		content += 'meta {\n';
		content += `  name: ${request.name}\n`;
		content += '  type: http\n';
		content += '}\n\n';

		// HTTP method and URL
		content += `${request.method.toLowerCase()} {\n`;
		content += `  url: ${request.url}\n`;
		content += '}\n\n';

		// Headers
		if (request.headers && Object.keys(request.headers).length > 0) {
			content += 'headers {\n';
			for (const [key, value] of Object.entries(request.headers)) {
				content += `  ${key}: ${value}\n`;
			}
			content += '}\n\n';
		}

		// Body
		if (request.body && request.body.content) {
			content += 'body {\n';
			content += request.body.content.split('\n').map(line => `  ${line}`).join('\n');
			content += '\n}\n\n';
		}

		// Tests
		if (request.tests && request.tests.length > 0) {
			content += 'tests {\n';
			for (const test of request.tests) {
				content += `  ${test}\n`;
			}
			content += '}\n';
		}

		return content;
	}

	private static generateId(): string {
		return Math.random().toString(36).substring(2, 15);
	}
}
