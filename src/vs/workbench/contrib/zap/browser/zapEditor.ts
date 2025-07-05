/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/zapEditor.css';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ZapEditorInput } from './zapEditorInput.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Dimension, append, $ } from '../../../../base/browser/dom.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ReactZapIntegration } from './reactZapIntegration.js';

export class ZapEditor extends EditorPane {
	static readonly ID = 'workbench.editor.zapEditor';

	private container!: HTMLElement;
	private editorContainer!: HTMLElement;
	private previewContainer!: HTMLElement;

	private codeEditor: ICodeEditor | undefined;
	private currentViewMode: 'source' | 'preview' = 'preview';
	private dimension: Dimension | undefined;
	private _isDisposed = false;

	// Context keys for view mode
	private viewModePreviewContextKey: IContextKey<boolean>;
	private viewModeSourceContextKey: IContextKey<boolean>;

	private readonly modelDisposables = this._register(new DisposableStore());
	private readonly inputDisposables = this._register(new DisposableStore());

	private reactZapIntegration: ReactZapIntegration;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService
	) {
		super(ZapEditor.ID, group, telemetryService, themeService, storageService);

		// Initialize context keys
		this.viewModePreviewContextKey = this._contextKeyService.createKey('zapViewMode.preview', true);
		this.viewModeSourceContextKey = this._contextKeyService.createKey('zapViewMode.source', false);

		// Initialize React integration
		this.reactZapIntegration = this._register(this.instantiationService.createInstance(ReactZapIntegration));
	}

	protected createEditor(parent: HTMLElement): void {
		// Main container
		this.container = append(parent, $('.zap-editor'));

		// Editor container (Monaco editor for source mode)
		this.editorContainer = append(this.container, $('.zap-editor-source'));
		this.editorContainer.style.display = 'none'; // Hidden by default (preview mode)

		// Preview container (Webview for preview mode)
		this.previewContainer = append(this.container, $('.zap-editor-preview'));
	}

	override async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		if (!(input instanceof ZapEditorInput)) {
			throw new Error('Invalid input type for ZapEditor');
		}

		// If already disposed, exit early
		if (this.isDisposed()) {
			return;
		}

		await super.setInput(input, options, context, token);

		// If disposed during async operation, exit early
		if (this.isDisposed()) {
			return;
		}

		// Clear previous disposables
		this.inputDisposables.clear();

		// Set up the editor based on view mode
		this.currentViewMode = input.viewMode;
		await this.updateView(input);

		// If disposed during async operation, exit early
		if (this.isDisposed()) {
			return;
		}

		// Listen for view mode changes
		this.inputDisposables.add(input.onDidChangeViewMode(mode => {
			// Skip if disposed
			if (this.isDisposed()) {
				return;
			}
			this.currentViewMode = mode;
			this.updateView(input).catch(onUnexpectedError);
		}));

		// Listen for content changes to refresh preview
		this.inputDisposables.add(input.onDidChangeContent(() => {
			// Skip if disposed
			if (this.isDisposed()) {
				return;
			}
			if (this.currentViewMode === 'preview') {
				// React component will handle its own updates
				// No need to manually refresh preview
			}
		}));
	}

	private async updateView(input: ZapEditorInput): Promise<void> {
		// If disposed, exit early
		if (this.isDisposed()) {
			return;
		}

		// Store current view mode
		this.currentViewMode = input.viewMode;

		// Update context keys for view mode
		this.viewModePreviewContextKey.set(this.currentViewMode === 'preview');
		this.viewModeSourceContextKey.set(this.currentViewMode === 'source');

		// If disposed after view mode update, exit early
		if (this.isDisposed()) {
			return;
		}

		if (this.currentViewMode === 'source') {
			await this.showSourceEditor(input);
		} else {
			await this.showPreview(input);
		}

		// Check if disposed after async operations
		if (this.isDisposed()) {
			return;
		}

		// Ensure layout is updated
		if (this.dimension) {
			this.layout(this.dimension);
		}
	}

	private async showSourceEditor(input: ZapEditorInput): Promise<void> {
		// Hide preview, show editor
		this.previewContainer.style.display = 'none';
		this.editorContainer.style.display = 'block';

		try {
			// Create Monaco editor if needed - guard against instantiation service being disposed
			if (!this.codeEditor && !this.isDisposed()) {
				// Initialize with proper dimensions
				const initialDimension = this.dimension || { width: 0, height: 0 };

				// Set container size before editor creation
				if (initialDimension.width > 0 && initialDimension.height > 0) {
					this.editorContainer.style.width = `${initialDimension.width}px`;
					this.editorContainer.style.height = `${initialDimension.height}px`;
				}

				try {
					// Create the editor with safe options
					this.codeEditor = this.instantiationService.createInstance(CodeEditorWidget, this.editorContainer, {
						scrollBeyondLastLine: false,
						minimap: {
							enabled: true
						},
						lineNumbers: 'on',
						folding: true,
						wordWrap: 'on',
						fixedOverflowWidgets: true,
						automaticLayout: true // Enable automatic layout to avoid layout issues
					}, {});

					// Use proper disposal tracking
					if (this.codeEditor) {
						this.modelDisposables.clear(); // Clear previous entries first
						this._register(this.codeEditor); // Register directly with the editor's disposal tracking
					}
				} catch (error) {
					console.error('Error creating code editor widget:', error);
					return;
				}
			}
		} catch (error) {
			console.error('Error creating code editor:', error);
			return;
		}

		// If the editor pane is disposed during async work, exit early
		if (this.isDisposed() || !this.codeEditor) {
			return;
		}

		// Get or create text model
		let model = this.modelService.getModel(input.resource);
		if (!model && !this.isDisposed()) {
			try {
				const content = await input.getContent();

				// Check again if we're disposed after the async operation
				if (this.isDisposed()) {
					return;
				}

				model = this.modelService.createModel(
					content,
					this.languageService.createById('zap'),
					input.resource
				);
				this.modelDisposables.add(model);
			} catch (error) {
				onUnexpectedError(error);
				return;
			}
		}

		// Set model to editor - check again if we're disposed
		if (!this.isDisposed() && this.codeEditor && model) {
			this.codeEditor.setModel(model);

			// Apply layout now that we have a model
			if (this.dimension) {
				this.codeEditor.layout(this.dimension);
			}

			// Focus editor if visible
			if (this.isVisible()) {
				this.codeEditor.focus();
			}
		}
	}
	private async mountZapReactComponent(input: ZapEditorInput) {
		try {
			const content = await input.getContent();
			await this.reactZapIntegration.renderZapInterface(this.previewContainer, content);
		} catch (error) {
			console.error('Error mounting zap React component:', error);
		}
	}

	private cleanupZapReactComponent() {
		this.reactZapIntegration.cleanup();
	}

	private async showPreview(input: ZapEditorInput): Promise<void> {
		// If disposed, exit early
		if (this.isDisposed()) {
			return;
		}

		// Hide editor, show preview
		this.editorContainer.style.display = 'none';
		this.previewContainer.style.display = 'block';

		try {
			// Only mount the React component, do not create extra HTML
			if (!this.previewContainer.dataset.previewInitialized && !this.isDisposed()) {
				while (this.previewContainer.firstChild) {
					this.previewContainer.removeChild(this.previewContainer.firstChild);
				}
				await this.mountZapReactComponent(input);
				this.previewContainer.dataset.previewInitialized = 'true';
			}

			if (!this.isDisposed() && this.isVisible()) {
				this.previewContainer.focus();
			}
		} catch (error) {
			onUnexpectedError(error);
		}
	}



	override clearInput(): void {
		// If already disposed, exit early
		if (this.isDisposed()) {
			return super.clearInput();
		}

		// Clear all disposables first
		this.inputDisposables.clear();

		// Cleanup React component
		this.cleanupZapReactComponent();

		// Clear preview content safely
		try {
			if (this.previewContainer && this.previewContainer.dataset.previewInitialized) {
				// Clear the container completely
				while (this.previewContainer.firstChild) {
					this.previewContainer.removeChild(this.previewContainer.firstChild);
				}
				this.previewContainer.dataset.previewInitialized = '';
			}
		} catch (error) {
			console.error('Error clearing preview content:', error);
		}

		// Clear editor model safely
		try {
			if (this.codeEditor && !this.isDisposed()) {
				this.codeEditor.setModel(null);
			}
		} catch (error) {
			console.error('Error clearing editor model:', error);
		}

		// Now clear model disposables after model is detached
		this.modelDisposables.clear();

		super.clearInput();
	}

	override focus(): void {
		super.focus();

		if (this.currentViewMode === 'source' && this.codeEditor) {
			this.codeEditor.focus();
		} else if (this.currentViewMode === 'preview' && this.previewContainer) {
			this.previewContainer.focus();
		}
	}

	override layout(dimension: Dimension): void {
		// Store the dimension for later use
		this.dimension = dimension;

		// Layout the main container
		this.container.style.width = `${dimension.width}px`;
		this.container.style.height = `${dimension.height}px`;

		// Layout Monaco editor
		if (this.codeEditor) {
			this.editorContainer.style.width = `${dimension.width}px`;
			this.editorContainer.style.height = `${dimension.height}px`;
			this.codeEditor.layout(dimension);
		}

		// Layout preview container
		this.previewContainer.style.width = `${dimension.width}px`;
		this.previewContainer.style.height = `${dimension.height}px`;
	}

	override getControl(): ICodeEditor | undefined {
		if (this.currentViewMode === 'source') {
			return this.codeEditor;
		} else {
			return undefined;
		}
	}

	private isDisposed(): boolean {
		return this._isDisposed;
	}

	override dispose(): void {
		this._isDisposed = true;

		// Clear any model first
		if (this.codeEditor) {
			this.codeEditor.setModel(null);
		}

		// Dispose of tracked disposables
		this.modelDisposables.dispose();
		this.inputDisposables.dispose();

		// Make sure we don't keep references
		this.codeEditor = undefined;

		// Call parent dispose
		super.dispose();
	}
}
