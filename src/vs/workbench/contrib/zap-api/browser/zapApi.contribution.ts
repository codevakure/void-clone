/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IViewContainersRegistry, ViewContainerLocation, Extensions as ViewContainerExtensions, IViewsRegistry } from '../../../common/views.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import * as nls from '../../../../nls.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ZapApiPane } from './zapApiPane.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ZapApiEditor } from './zapApiEditor.js';
import { ZapApiEditorInput } from './zapApiEditorInput.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { EditorExtensions } from '../../../common/editor.js';
import { MenuRegistry, MenuId } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ZAP_API_COMMANDS } from '../common/zapApiConstants.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import './media/zapApi.css';

// Register view container
const VIEW_CONTAINER_ID = 'zapApiContainer';
const VIEW_ID = 'zapApiView';

const VIEW_CONTAINER = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: VIEW_CONTAINER_ID,
	title: nls.localize2('zapApi.container.title', 'Zap API Testing'),
	icon: Codicon.globe,
	ctorDescriptor: new SyncDescriptor(ViewPaneContainer, [VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]),
	storageId: VIEW_CONTAINER_ID,
	hideIfEmpty: false,
	order: 4,
}, ViewContainerLocation.Sidebar);

// Register view
Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: VIEW_ID,
	name: nls.localize2('zapApi.view.title', 'Collections'),
	ctorDescriptor: new SyncDescriptor(ZapApiPane),
	canToggleVisibility: false,
	canMoveView: true,
	containerIcon: Codicon.globe,
	when: undefined
}], VIEW_CONTAINER);

// Register editor pane for Zap API requests
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ZapApiEditor,
		ZapApiEditor.ID,
		nls.localize('zapApiEditor', 'Zap API Editor')
	),
	[new SyncDescriptor(ZapApiEditorInput)]
);

// Register toggle view command
CommandsRegistry.registerCommand({
	id: ZAP_API_COMMANDS.TOGGLE_VIEW,
	handler: (accessor) => {
		const editorService = accessor.get(IEditorService);
		const activeEditor = editorService.activeEditor;

		if (activeEditor instanceof ZapApiEditorInput) {
			// Dispatch custom event to toggle view in React component
			const event = new CustomEvent('zap-api:toggle-view', {
				detail: { editorId: activeEditor.resource.toString() }
			});
			window.dispatchEvent(event);
		}
	}
});

// Register toggle button in editor title bar (tab bar)
MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
	command: {
		id: ZAP_API_COMMANDS.TOGGLE_VIEW,
		title: nls.localize('zapApi.toggleView', 'Toggle Request/Response and Code View'),
		icon: Codicon.splitHorizontal
	},
	when: ContextKeyExpr.or(
		ContextKeyExpr.equals('activeEditor', ZapApiEditor.ID),
		ContextKeyExpr.equals('resourceExtname', '.bru')
	),
	group: 'navigation',
	order: 1
});

export class ZapApiContribution implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.zapApi';
}

// Register the contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(ZapApiContribution, LifecyclePhase.Restored);
