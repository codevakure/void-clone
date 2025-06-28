/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ZapApiEditorInput } from './zapApiEditorInput.js';
import { mountZapApiEditor } from './react/out/index.js';

/**
 * Editor pane for Zap API requests that renders in the main editor area
 */
export class ZapApiEditor extends EditorPane {

	public static readonly ID = 'workbench.editor.zapApiEditor';

	private _editorContainer?: HTMLElement;
	private _currentInput?: ZapApiEditorInput;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService
	) {
		super(ZapApiEditor.ID, group, telemetryService, themeService, storageService);
	}

	override async setInput(input: ZapApiEditorInput, options: any, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		this._currentInput = input;

		if (this._editorContainer) {
			this.renderEditor();
		}
	}

	override clearInput(): void {
		this._currentInput = undefined;
		if (this._editorContainer) {
			// Clear children safely without using innerHTML
			while (this._editorContainer.firstChild) {
				this._editorContainer.removeChild(this._editorContainer.firstChild);
			}
		}
		super.clearInput();
	}

	protected override createEditor(parent: HTMLElement): void {
		this._editorContainer = parent;
		this._editorContainer.style.width = '100%';
		this._editorContainer.style.height = '100%';
		this._editorContainer.style.overflow = 'hidden';

		if (this._currentInput) {
			this.renderEditor();
		}
	}

	override layout(dimension: Dimension): void {
		if (this._editorContainer) {
			this._editorContainer.style.width = `${dimension.width}px`;
			this._editorContainer.style.height = `${dimension.height}px`;
		}
	}

	override focus(): void {
		if (this._editorContainer) {
			this._editorContainer.focus();
		}
	}

	private renderEditor(): void {
		if (!this._editorContainer || !this._currentInput) {
			return;
		}

		// Clear previous content safely
		while (this._editorContainer.firstChild) {
			this._editorContainer.removeChild(this._editorContainer.firstChild);
		}

		try {
			// Mount the React component for the request editor
			mountZapApiEditor(this._editorContainer, {
				request: this._currentInput.request,
				collectionId: this._currentInput.collectionId
			});
		} catch (error) {
			console.error('Failed to load Zap API Editor React component:', error);
			this.renderFallback();
		}
	}

	private renderFallback(): void {
		if (!this._editorContainer || !this._currentInput) {
			return;
		}

		const { request } = this._currentInput;

		// Create elements using DOM API to avoid innerHTML security issues
		const container = document.createElement('div');
		container.style.cssText = 'padding: 20px; height: 100%; box-sizing: border-box; overflow-y: auto;';

		const innerContainer = document.createElement('div');
		innerContainer.style.cssText = 'max-width: 800px;';

		// Title
		const title = document.createElement('h2');
		title.style.cssText = 'margin: 0 0 20px 0; color: var(--vscode-foreground);';
		title.textContent = `${request.method} ${request.name}`;
		innerContainer.appendChild(title);

		// URL section
		const urlSection = document.createElement('div');
		urlSection.style.cssText = 'margin-bottom: 16px;';

		const urlLabel = document.createElement('label');
		urlLabel.style.cssText = 'display: block; margin-bottom: 4px; font-weight: 600; color: var(--vscode-foreground);';
		urlLabel.textContent = 'URL:';
		urlSection.appendChild(urlLabel);

		const urlValue = document.createElement('div');
		urlValue.style.cssText = 'padding: 8px; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border); border-radius: 3px; color: var(--vscode-input-foreground);';
		urlValue.textContent = request.url || 'No URL specified';
		urlSection.appendChild(urlValue);

		innerContainer.appendChild(urlSection);

		// Method section
		const methodSection = document.createElement('div');
		methodSection.style.cssText = 'margin-bottom: 16px;';

		const methodLabel = document.createElement('label');
		methodLabel.style.cssText = 'display: block; margin-bottom: 4px; font-weight: 600; color: var(--vscode-foreground);';
		methodLabel.textContent = 'Method:';
		methodSection.appendChild(methodLabel);

		const methodValue = document.createElement('div');
		methodValue.style.cssText = 'padding: 8px; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border); border-radius: 3px; color: var(--vscode-input-foreground);';
		methodValue.textContent = request.method;
		methodSection.appendChild(methodValue);

		innerContainer.appendChild(methodSection);

		// Error message
		const errorMessage = document.createElement('div');
		errorMessage.style.cssText = 'color: var(--vscode-descriptionForeground); font-style: italic;';
		errorMessage.textContent = 'React component failed to load. Showing basic fallback view.';
		innerContainer.appendChild(errorMessage);

		container.appendChild(innerContainer);
		this._editorContainer.appendChild(container);
	}
}
