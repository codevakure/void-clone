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
	border: 1px solid var(--vscode-panel-border);
	border-radius: 6px;
	margin: 16px 0;
	overflow: hidden;
	background-color: var(--vscode-editor-background);
}

.zap-header {
	background-color: var(--vscode-list-hoverBackground);
	border-bottom: 1px solid var(--vscode-panel-border);
	padding: 12px 16px;
	font-weight: 600;
	font-size: 16px;
	color: var(--vscode-foreground);
}

.zap-meta-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 14px;
	background-color: var(--vscode-editor-background);
}

.zap-meta-table th {
	background-color: var(--vscode-list-hoverBackground);
	text-align: left;
	padding: 12px 16px;
	border-bottom: 1px solid var(--vscode-panel-border);
	font-weight: 600;
	color: var(--vscode-foreground);
}

.zap-meta-table td {
	padding: 10px 16px;
	border-bottom: 1px solid var(--vscode-list-inactiveSelectionBackground);
	vertical-align: top;
}

.zap-meta-table tr:last-child td {
	border-bottom: none;
}

.zap-meta-table tr:nth-child(even) {
	background-color: var(--vscode-list-inactiveSelectionBackground);
}

.zap-meta-table tr:hover {
	background-color: var(--vscode-list-hoverBackground);
}

.zap-key {
	font-weight: 500;
	color: var(--vscode-symbolIcon-propertyForeground);
	width: 30%;
}

.zap-value {
	color: var(--vscode-foreground);
	word-break: break-all;
}

.zap-empty {
	padding: 20px;
	text-align: center;
	color: var(--vscode-descriptionForeground);
	font-style: italic;
}

.zap-error {
	padding: 20px;
	text-align: center;
	color: var(--vscode-errorForeground);
	background-color: var(--vscode-inputValidation-errorBackground);
	border-radius: 4px;
	margin: 16px 0;
}
`;

export function renderZapDocument(zapContent: string): string {
	try {
		const metaData = ZapParser.parseZapFile(zapContent);

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
						<td class="zap-key">${escapedKey}</td>
						<td class="zap-value">${escapedValue}</td>
					</tr>
				`;
			})
			.join('');

		return `
			<div class="zap-container">
				<div class="zap-header">ZAP Metadata</div>
				<table class="zap-meta-table">
					<thead>
						<tr>
							<th>Property</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						${rows}
					</tbody>
				</table>
			</div>
		`;
	} catch (error) {
		return `
			<div class="zap-container">
				<div class="zap-header">ZAP Metadata</div>
				<div class="zap-error">Error parsing ZAP file: ${escape(String(error))}</div>
			</div>
		`;
	}
}
