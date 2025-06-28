/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { IViewPaneOptions, ViewPane } from '../../../browser/parts/views/viewPane.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IViewDescriptorService } from '../../../common/views.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { addDisposableListener } from '../../../../base/browser/dom.js';
import { mountZapApi } from './react/out/index.js';
import { ZapApiEditorInput } from './zapApiEditorInput.js';
import { ZapRequest } from '../common/zapApiTypes.js';

export class ZapApiPane extends ViewPane {

	constructor(
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
		@IEditorService private readonly editorService: IEditorService
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);

		// Listen for custom event from React component to open request as editor
		this._register(addDisposableListener(window, 'zap-api:open-request-editor', (e: CustomEvent) => {
			this.handleOpenRequestAsEditor(e.detail);
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);
		this.createReactContent(container);
	}

	private createReactContent(container: HTMLElement): void {
		// Create a div for React to mount into
		const reactContainer = document.createElement('div');
		reactContainer.style.width = '100%';
		reactContainer.style.height = '100%';
		container.appendChild(reactContainer);

		try {
			// Mount the React component directly
			mountZapApi(reactContainer);
		} catch (error) {
			console.error('Failed to load Zap API React component:', error);
			// Fall back to simple content
			this.createFallbackContent(reactContainer);
		}
	}

	private createFallbackContent(container: HTMLElement): void {
		container.innerHTML = `
			<div class="zap-api-pane">
				<div class="zap-api-header">
					<h3>Zap API Testing</h3>
					<p>React component failed to load</p>
				</div>
			</div>
		`;
	}

	private async handleOpenRequestAsEditor(detail: { request: ZapRequest; collectionId: string }): Promise<void> {
		try {
			const { request, collectionId } = detail;

			// Create the ZapApiEditorInput
			const editorInput = ZapApiEditorInput.create(this.instantiationService, {
				request,
				collectionId
			});

			// Open the editor in the main editor area
			await this.editorService.openEditor(editorInput, {
				pinned: true, // Pin the editor so it doesn't get replaced
				preserveFocus: false // Give focus to the new editor
			});
		} catch (error) {
			console.error('Failed to open Zap API request as editor:', error);
		}
	}
}
