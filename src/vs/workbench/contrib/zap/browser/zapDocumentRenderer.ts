/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { escape } from '../../../../base/common/strings.js';
import { ZapParser } from './zapParser.js';

export const DEFAULT_ZAP_STYLES = `
body {
	padding: 10px 20px;
	line-height: 22px;
	max-width: 882px;
	margin: 0 auto;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	color: var(--vscode-foreground);
	background-color: var(--vscode-editor-background);
}

body *:last-child {
	margin-bottom: 0;
}

.zap-container {
	border: 1px solid var(--vscode-panel-border, #e1e4e8);
	border-radius: 6px;
	margin: 16px 0;
	overflow: hidden;
	background-color: var(--vscode-editor-background, #ffffff);
}

.zap-header {
	background-color: var(--vscode-list-hoverBackground, #f6f8fa);
	border-bottom: 1px solid var(--vscode-panel-border, #e1e4e8);
	padding: 12px 16px;
	font-weight: 600;
	font-size: 16px;
	color: var(--vscode-foreground, #24292e);
}

.zap-meta-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	background-color: var(--vscode-editor-background, #ffffff);
	table-layout: fixed;
}

.zap-meta-table th {
	background-color: var(--vscode-list-hoverBackground, #f6f8fa);
	text-align: left;
	padding: 12px 16px;
	border-bottom: 1px solid var(--vscode-panel-border, #e1e4e8);
	font-weight: 600;
	color: var(--vscode-foreground, #24292e);
}

.zap-meta-table td {
	padding: 10px 16px;
	border-bottom: 1px solid var(--vscode-list-inactiveSelectionBackground, #f3f4f6);
	vertical-align: top;
	word-wrap: break-word;
}

.zap-meta-table tr:last-child td {
	border-bottom: none;
}

.zap-meta-table tr:nth-child(even) {
	background-color: var(--vscode-list-inactiveSelectionBackground, #f8f9fa);
}

.zap-meta-table tr:hover {
	background-color: var(--vscode-list-hoverBackground, #f6f8fa);
}

.zap-key {
	font-weight: 500;
	color: var(--vscode-symbolIcon-propertyForeground, #0969da);
	width: 30%;
}

.zap-value {
	color: var(--vscode-foreground, #24292e);
	word-break: break-all;
	max-width: 0;
	overflow-wrap: break-word;
}

.zap-empty {
	padding: 20px;
	text-align: center;
	color: var(--vscode-descriptionForeground, #656d76);
	font-style: italic;
}

.zap-error {
	padding: 20px;
	text-align: center;
	color: var(--vscode-errorForeground, #cf222e);
	background-color: var(--vscode-inputValidation-errorBackground, #fff5f5);
	border-radius: 4px;
	margin: 16px 0;
}
`;

export function renderZapDocument(zapContent: string): string {
	try {
		const metaData = ZapParser.parseZapFile(zapContent);

		// Debug: Let's see what we're actually getting
		console.log('Raw ZAP content (first 500 chars):', zapContent.substring(0, 500));
		console.log('Parsed metadata:', metaData);
		console.log('Metadata keys:', Object.keys(metaData));
		console.log('Has metadata?', Object.keys(metaData).length > 0);

		if (!metaData || Object.keys(metaData).length === 0) {
			return `
				<div class="zap-container">
					<div class="zap-header">ZAP Metadata</div>
					<div class="zap-empty">No metadata found in this ZAP file</div>
				</div>
			`;
		}

		const rows = Object.entries(metaData)
			.map(([key, value]) => {
				const escapedKey = escape(key);
				let escapedValue: string;

				if (typeof value === 'object' && value !== null) {
					escapedValue = escape(JSON.stringify(value, null, 2));
				} else {
					escapedValue = escape(String(value));
				}

				return `
					<tr>
						<td class="zap-key" style="font-weight: 500; padding: 10px 16px; border-bottom: 1px solid #f3f4f6; width: 30%;">${escapedKey}</td>
						<td class="zap-value" style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6; word-wrap: break-word;">${escapedValue}</td>
					</tr>
				`;
			})
			.join('');

		console.log('Generated table rows:', rows);

		const tableHtml = `
			<div class="zap-container" style="border: 1px solid #e1e4e8; border-radius: 6px; margin: 16px 0; overflow: hidden;">
				<div class="zap-header" style="background-color: #f6f8fa; border-bottom: 1px solid #e1e4e8; padding: 12px 16px; font-weight: 600; font-size: 16px;">ZAP Metadata</div>
				<table class="zap-meta-table" style="width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed;">
					<thead>
						<tr>
							<th style="background-color: #f6f8fa; text-align: left; padding: 12px 16px; border-bottom: 1px solid #e1e4e8; font-weight: 600; width: 30%;">Property</th>
							<th style="background-color: #f6f8fa; text-align: left; padding: 12px 16px; border-bottom: 1px solid #e1e4e8; font-weight: 600;">Value</th>
						</tr>
					</thead>
					<tbody>
						${rows}
					</tbody>
				</table>
			</div>
		`;

		console.log('Final table HTML:', tableHtml);
		return tableHtml;
	} catch (error) {
		return `
			<div class="zap-container">
				<div class="zap-header">ZAP Metadata</div>
				<div class="zap-error">Error parsing ZAP file: ${escape(String(error))}</div>
			</div>
		`;
	}
}
