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
import { ZapFileEditorInput } from './zapFileEditorInput.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { mountZapApiEditor } from './react/out/index.js';
import { ZapRequest } from '../common/zapApiTypes.js';

/**
 * Custom editor for .zap files that shows the design view by default with toggle to code view
 */
export class ZapFileEditor extends EditorPane {

	public static readonly ID = 'workbench.editor.zapFileEditor';

	private _editorContainer?: HTMLElement;
	private _currentInput?: ZapFileEditorInput;
	private _viewMode: 'design' | 'code' = 'design';
	private _zapRequest?: ZapRequest;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@IEditorService private readonly editorService: IEditorService
	) {
		super(ZapFileEditor.ID, group, telemetryService, themeService, storageService);
	}

	override async setInput(input: ZapFileEditorInput, options: any, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);

		this._currentInput = input;

		// Parse the .zap file content to extract request information
		await this.parseZapFile();

		if (this._editorContainer) {
			this.renderEditor();
		}
	}

	private async parseZapFile(): Promise<void> {
		if (!this._currentInput) {
			return;
		}

		try {
			// Read the .zap file content
			const content = await this.fileService.readFile(this._currentInput.resource);
			const zapContent = content.value.toString();

			// Parse the .zap file format to extract request information
			this._zapRequest = this.parseZapContent(zapContent);
		} catch (error) {
			console.error('Failed to parse .zap file:', error);
			// Create a default request object
			this._zapRequest = {
				id: 'default',
				name: 'Untitled Request',
				method: 'GET',
				url: '',
				headers: {},
				body: {
					type: 'text',
					content: ''
				},
				auth: undefined
			};
		}
	}

	private parseZapContent(content: string): ZapRequest {
		// Simple parser for .zap file format
		// This is a basic implementation - in a real scenario you'd want a more robust parser
		const lines = content.split('\n');
		const request: ZapRequest = {
			id: 'parsed',
			name: 'API Request',
			method: 'GET',
			url: '',
			headers: {},
			body: {
				type: 'text',
				content: ''
			},
			auth: undefined
		};

		let currentSection = '';
		let inSection = false;

		for (const line of lines) {
			const trimmed = line.trim();

			if (trimmed.startsWith('meta {')) {
				currentSection = 'meta';
				inSection = true;
				continue;
			} else if (trimmed.startsWith('http {')) {
				currentSection = 'http';
				inSection = true;
				continue;
			} else if (trimmed.startsWith('headers {')) {
				currentSection = 'headers';
				inSection = true;
				continue;
			} else if (trimmed.startsWith('body:')) {
				currentSection = 'body';
				inSection = true;
				continue;
			} else if (trimmed === '}') {
				inSection = false;
				currentSection = '';
				continue;
			}

			if (inSection) {
				const colonIndex = trimmed.indexOf(':');
				if (colonIndex > 0) {
					const key = trimmed.substring(0, colonIndex).trim();
					const value = trimmed.substring(colonIndex + 1).trim();

					switch (currentSection) {
						case 'meta':
							if (key === 'name') {
								request.name = value;
							}
							break;
						case 'http':
							if (key === 'method') {
								request.method = value.toUpperCase() as any;
							} else if (key === 'url') {
								request.url = value;
							}
							break;
						case 'headers':
							request.headers[key] = value;
							break;
					}
				}
			}
		}

		return request;
	}

	override clearInput(): void {
		this._currentInput = undefined;
		this._zapRequest = undefined;
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

	public toggleView(): void {
		this._viewMode = this._viewMode === 'design' ? 'code' : 'design';

		if (this._viewMode === 'code') {
			this.openInTextEditor();
		} else {
			this.renderEditor();
		}
	}

	private async openInTextEditor(): Promise<void> {
		if (!this._currentInput) {
			return;
		}

		// Open the .zap file in the regular text editor (overriding this custom editor)
		await this.editorService.openEditor({
			resource: this._currentInput.resource,
			options: {
				pinned: true,
				preserveFocus: false,
				override: 'default' // This forces opening with the default text editor
			}
		});
	}

	private renderEditor(): void {
		if (!this._editorContainer || !this._currentInput || !this._zapRequest) {
			return;
		}

		// Clear previous content safely
		while (this._editorContainer.firstChild) {
			this._editorContainer.removeChild(this._editorContainer.firstChild);
		}

		if (this._viewMode === 'design') {
			this.renderDesignView();
		}
	}

	private renderDesignView(): void {
		if (!this._editorContainer || !this._zapRequest) {
			return;
		}

		try {
			// Mount the React component for the request editor
			mountZapApiEditor(this._editorContainer, {
				request: this._zapRequest,
				collectionId: 'file-editor'
			});
		} catch (error) {
			console.error('Failed to load Zap API Editor React component:', error);
		}
	}
}
