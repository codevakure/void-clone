/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ZapMetaData {
	name?: string;
	type?: string;
	seq?: number;
	description?: string;
	[key: string]: any;
}

export class ZapParser {

	/**
	 * Parse a ZAP file content and extract the meta block
	 */
	public static parseZapFile(content: string): ZapMetaData {
		const metaMatch = content.match(/meta\s*\{([^}]*)\}/s);
		if (!metaMatch) {
			return {};
		}

		const metaContent = metaMatch[1];
		const metaData: ZapMetaData = {};

		// Parse key-value pairs
		const lines = metaContent.split('\n');
		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('//')) {
				continue;
			}

			const colonIndex = trimmed.indexOf(':');
			if (colonIndex > 0) {
				const key = trimmed.substring(0, colonIndex).trim();
				let value = trimmed.substring(colonIndex + 1).trim();

				// Remove trailing comma if present
				if (value.endsWith(',')) {
					value = value.slice(0, -1);
				}

				// Parse value based on type
				if (value === 'true' || value === 'false') {
					metaData[key] = value === 'true';
				} else if (!isNaN(Number(value))) {
					metaData[key] = Number(value);
				} else {
					// Remove quotes if present
					if ((value.startsWith('"') && value.endsWith('"')) ||
						(value.startsWith("'") && value.endsWith("'"))) {
						value = value.slice(1, -1);
					}
					metaData[key] = value;
				}
			}
		}

		return metaData;
	}
}
