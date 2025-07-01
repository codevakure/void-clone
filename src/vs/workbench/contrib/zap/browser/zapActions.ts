/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize2 } from '../../../../nls.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ZapEditorInput } from './zapEditorInput.js';
import { registerAction2, MenuId } from '../../../../platform/actions/common/actions.js';
import { Codicon } from '../../../../base/common/codicons.js';

// Context key for when a ZAP file is active
export const ZAP_FILE_CONTEXT = ContextKeyExpr.regex('resourceExtname', /\.zap$/);

class ToggleZapViewModeAction extends Action2 {
	constructor() {
		super({
			id: 'zap.toggleViewMode',
			title: localize2('zap.toggleViewMode', 'Toggle ZAP View Mode'),
			category: localize2('zap.category', 'ZAP'),
			precondition: ZAP_FILE_CONTEXT,
			keybinding: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyV
			},
			menu: [
				{
					id: MenuId.CommandPalette,
					when: ZAP_FILE_CONTEXT
				}
			]
		});
	}

	run(accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;

		if (activeEditorPane && activeEditorPane.input instanceof ZapEditorInput) {
			try {
				activeEditorPane.input.toggleViewMode();
			} catch (error) {
				console.error('Error toggling ZAP view mode:', error);
			}
		}
	}
}

class ShowZapSourceAction extends Action2 {
	constructor() {
		super({
			id: 'zap.showSource',
			title: localize2('zap.showSource', 'Show ZAP Source'),
			category: localize2('zap.category', 'ZAP'),
			// Only show when in preview mode
			precondition: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.preview')),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.preview')),
					group: 'navigation',
					order: 1
				},
				{
					id: MenuId.EditorTitleContext,
					when: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.preview')),
					group: '1_view'
				},
				{
					id: MenuId.CommandPalette,
					when: ZAP_FILE_CONTEXT
				}
			],
			icon: Codicon.code
		});
	}

	run(accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;

		if (activeEditorPane && activeEditorPane.input instanceof ZapEditorInput) {
			try {
				activeEditorPane.input.setViewMode('source');
			} catch (error) {
				console.error('Error showing ZAP source:', error);
			}
		}
	}
}

class ShowZapPreviewAction extends Action2 {
	constructor() {
		super({
			id: 'zap.showPreview',
			title: localize2('zap.showPreview', 'Show ZAP Preview'),
			category: localize2('zap.category', 'ZAP'),
			// Only show when in source mode
			precondition: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.source')),
			menu: [
				{
					id: MenuId.EditorTitle,
					when: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.source')),
					group: 'navigation',
					order: 1
				},
				{
					id: MenuId.EditorTitleContext,
					when: ContextKeyExpr.and(ZAP_FILE_CONTEXT, ContextKeyExpr.equals('activeEditor', 'workbench.editor.zapEditor'), ContextKeyExpr.has('zapViewMode.source')),
					group: '1_view'
				},
				{
					id: MenuId.CommandPalette,
					when: ZAP_FILE_CONTEXT
				}
			],
			icon: Codicon.openPreview
		});
	}

	run(accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;

		if (activeEditorPane && activeEditorPane.input instanceof ZapEditorInput) {
			try {
				activeEditorPane.input.setViewMode('preview');
			} catch (error) {
				console.error('Error showing ZAP preview:', error);
			}
		}
	}
}

// Removed OpenZapPreviewToSideAction as we're simplifying the UI

// Register all actions
registerAction2(ToggleZapViewModeAction);
registerAction2(ShowZapSourceAction);
registerAction2(ShowZapPreviewAction);
