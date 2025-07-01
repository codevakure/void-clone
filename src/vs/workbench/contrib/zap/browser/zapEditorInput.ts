/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { EditorInputCapabilities, Verbosity } from '../../../common/editor.js';
import { URI } from '../../../../base/common/uri.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { Emitter } from '../../../../base/common/event.js';

export class ZapEditorInput extends EditorInput {
	static readonly ID = 'workbench.input.zapEditor';

	override get capabilities() {
		return EditorInputCapabilities.CanSplitInGroup | EditorInputCapabilities.Singleton | EditorInputCapabilities.RequiresTrust;
	}

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private _viewMode: 'source' | 'preview' = 'preview'; // Default to preview mode
	private readonly _onDidChangeViewMode = this._register(new Emitter<'source' | 'preview'>());
	readonly onDidChangeViewMode = this._onDidChangeViewMode.event;

	private fileWatcher: IDisposable | undefined;

	constructor(
		public readonly resource: URI,
		@ITextFileService private readonly textFileService: ITextFileService,
		@ILabelService private readonly labelService: ILabelService,
		@IFileService private readonly fileService: IFileService
	) {
		super();

		// Watch for file changes
		this.fileWatcher = this.fileService.watch(this.resource);
		this._register(this.fileWatcher);

		// Listen for external file changes
		this._register(this.fileService.onDidFilesChange(e => {
			if (e.affects(this.resource)) {
				this._onDidChangeContent.fire();
			}
		}));
	}

	override get typeId(): string {
		return ZapEditorInput.ID;
	}

	override get editorId(): string {
		// Using string literal to avoid circular dependency with ZapEditor
		return 'workbench.editor.zapEditor';
	}

	override getName(): string {
		return this.labelService.getUriBasenameLabel(this.resource);
	}

	override getDescription(verbosity?: Verbosity): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.labelService.getUriBasenameLabel(this.resource.with({ path: this.resource.path.substring(0, this.resource.path.lastIndexOf('/')) }));
			case Verbosity.LONG:
				return this.labelService.getUriLabel(this.resource);
			default:
				return this.labelService.getUriBasenameLabel(this.resource.with({ path: this.resource.path.substring(0, this.resource.path.lastIndexOf('/')) }));
		}
	}

	override getTitle(verbosity?: Verbosity): string {
		const name = this.getName();
		const description = this.getDescription(verbosity);
		const modeLabel = this._viewMode === 'source' ? localize('zapSource', "Source") : localize('zapPreview', "Preview");

		if (description) {
			return `${name} (${modeLabel}) - ${description}`;
		}

		return `${name} (${modeLabel})`;
	}

	override matches(otherInput: EditorInput): boolean {
		if (!(otherInput instanceof ZapEditorInput)) {
			return false;
		}

		return otherInput.resource.toString() === this.resource.toString();
	}

	get viewMode(): 'source' | 'preview' {
		return this._viewMode;
	}

	setViewMode(mode: 'source' | 'preview'): void {
		if (this._viewMode !== mode) {
			this._viewMode = mode;
			this._onDidChangeViewMode.fire(mode);
			this._onDidChangeDirty.fire(); // Title includes mode, so trigger label update
		}
	}

	toggleViewMode(): void {
		this.setViewMode(this._viewMode === 'source' ? 'preview' : 'source');
	}

	override isDirty(): boolean {
		// ZAP files are read-only in preview mode, only dirty in source mode if underlying file is dirty
		if (this._viewMode === 'preview') {
			return false;
		}

		const textModel = this.textFileService.files.get(this.resource);
		return textModel?.isDirty() ?? false;
	}

	override isReadonly(): boolean {
		// Preview mode is always readonly
		if (this._viewMode === 'preview') {
			return true;
		}

		// For source mode, just return false for now
		return false;
	}

	async getContent(): Promise<string> {
		try {
			// Use isDisposed to guard against accessing disposed services
			if (this._disposed) {
				return '';
			}
			const content = await this.fileService.readFile(this.resource);
			return content.value.toString();
		} catch (error) {
			console.error('Error reading ZAP file:', error);
			return '';
		}
	}

	// Track disposal state
	private _disposed = false;

	override dispose(): void {
		this._disposed = true;
		dispose(this.fileWatcher);
		super.dispose();
	}
}
