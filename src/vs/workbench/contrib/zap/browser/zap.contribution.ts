/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ModesRegistry } from '../../../../editor/common/languages/modesRegistry.js';
import { EditorExtensions } from '../../../common/editor.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ZapEditorInput } from './zapEditorInput.js';
import { ZapEditor } from './zapEditor.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { DiffEditorInput } from '../../../common/editor/diffEditorInput.js';
import './zapActions.js'; // Import actions to register them

// Register ZAP language
ModesRegistry.registerLanguage({
	id: 'zap',
	extensions: ['.zap'],
	aliases: ['ZAP', 'zap'],
	mimetypes: ['text/plain']
});

// Register ZAP editor pane
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ZapEditor,
		ZapEditor.ID,
		localize('zapEditor', 'ZAP Editor')
	),
	[
		new SyncDescriptor(ZapEditorInput)
	]
);

// ZAP file editor resolver
class ZapEditorContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IEditorResolverService private readonly editorResolverService: IEditorResolverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.registerZapEditor();
	}

	private registerZapEditor(): void {
		// Register ZAP editor resolver
		this._register(this.editorResolverService.registerEditor(
			'*.zap',
			{
				id: ZapEditor.ID,
				label: localize('zapEditor', 'ZAP Editor'),
				priority: RegisteredEditorPriority.builtin
			},
			{},
			{
				createEditorInput: ({ resource, options }) => {
					const input = this.instantiationService.createInstance(ZapEditorInput, resource);
					// Default to preview mode for .zap files
					input.setViewMode('preview');
					return { editor: input };
				},
				createDiffEditorInput: ({ original, modified, options }) => {
					// For diff editing, create ZAP editor inputs in source mode to show text differences
					// We know these should exist since we're being called for ZAP files
					const originalInput = this.instantiationService.createInstance(ZapEditorInput, original.resource!);
					const modifiedInput = this.instantiationService.createInstance(ZapEditorInput, modified.resource!);

					// Set both to source mode for diff viewing
					originalInput.setViewMode('source');
					modifiedInput.setViewMode('source');

					// Create a diff editor input using VS Code's built-in DiffEditorInput
					const diffInput = this.instantiationService.createInstance(
						DiffEditorInput,
						localize('zapDiff', 'ZAP Comparison'),
						localize('zapDiffDescription', 'Compare ZAP files'),
						originalInput,
						modifiedInput,
						undefined
					);

					return { editor: diffInput };
				}
			}
		));
	}
}

// Register the contribution
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(
	ZapEditorContribution,
	LifecyclePhase.Restored
);
