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
		console.log('ZapParser: Starting to parse content...');
		console.log('ZapParser: Content length:', content.length);
		console.log('ZapParser: First 300 chars:', content.substring(0, 300));

		// Try to find the meta block using regex
		const metaMatch = content.match(/meta\s*\{([^}]*)\}/s);
		console.log('ZapParser: Meta match found:', !!metaMatch);

		if (!metaMatch) {
			console.log('ZapParser: No meta block found');
			return {};
		}

		const metaContent = metaMatch[1];
		console.log('ZapParser: Meta content:', metaContent);

		const metaData: ZapMetaData = {};

		// Parse key-value pairs
		const lines = metaContent.split('\n');
		console.log('ZapParser: Lines to parse:', lines);

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const trimmed = line.trim();
			console.log(`ZapParser: Processing line ${i}: "${trimmed}"`);

			if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
				console.log(`ZapParser: Skipping line ${i} (empty or comment)`);
				continue;
			}

			const colonIndex = trimmed.indexOf(':');
			if (colonIndex > 0) {
				const key = trimmed.substring(0, colonIndex).trim();
				let value = trimmed.substring(colonIndex + 1).trim();

				console.log(`ZapParser: Found key-value pair: "${key}" = "${value}"`);

				// Remove trailing comma if present
				if (value.endsWith(',')) {
					value = value.slice(0, -1).trim();
				}

				// Parse value based on type
				if (value === 'true' || value === 'false') {
					metaData[key] = value === 'true';
				} else if (/^\d+$/.test(value)) {
					metaData[key] = Number(value);
				} else if (/^\d+\.\d+$/.test(value)) {
					metaData[key] = Number(value);
				} else {
					// Handle quoted strings
					if ((value.startsWith('"') && value.endsWith('"')) ||
						(value.startsWith("'") && value.endsWith("'"))) {
						value = value.slice(1, -1);
					}
					metaData[key] = value;
				}

				console.log(`ZapParser: Added to metadata: "${key}" = "${metaData[key]}"`);
			} else {
				console.log(`ZapParser: No colon found in line ${i}: "${trimmed}"`);
			}
		}

		console.log('ZapParser: Final metadata:', metaData);
		return metaData;
	}
}
