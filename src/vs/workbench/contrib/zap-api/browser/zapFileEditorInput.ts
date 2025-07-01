/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { EditorInputCapabilities, IUntypedEditorInput, Verbosity } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export interface ZapFileEditorInputOptions {
	readonly resource: URI;
}

/**
 * Editor input for .zap files that opens in the custom design view editor
 */
export class ZapFileEditorInput extends EditorInput {

	public static readonly typeId = 'workbench.editors.zapFileEditor';

	private readonly _resource: URI;

	public static create(
		instantiationService: IInstantiationService,
		options: ZapFileEditorInputOptions
	): ZapFileEditorInput {
		return instantiationService.createInstance(ZapFileEditorInput, options);
	}

	constructor(
		options: ZapFileEditorInputOptions
	) {
		super();
		this._resource = options.resource;
	}

	public override get typeId(): string {
		return ZapFileEditorInput.typeId;
	}

	public override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.CanSplitInGroup;
	}

	public override get resource(): URI {
		return this._resource;
	}

	public override getName(): string {
		return this._resource.path.split('/').pop() || 'Untitled';
	}

	public override getDescription(verbosity?: Verbosity): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return 'Zap API Request';
			case Verbosity.MEDIUM:
				return 'Zap API Request File';
			case Verbosity.LONG:
				return `Zap API Request File - ${this._resource.fsPath}`;
			default:
				return 'Zap API Request';
		}
	}

	public override getTitle(verbosity?: Verbosity): string {
		return this.getName();
	}

	public override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (otherInput === this) {
			return true;
		}

		if (otherInput instanceof ZapFileEditorInput) {
			return this._resource.toString() === otherInput._resource.toString();
		}

		if (otherInput && 'resource' in otherInput) {
			return this._resource.toString() === otherInput.resource?.toString();
		}

		return false;
	}

	public override toUntyped(): IUntypedEditorInput {
		return {
			resource: this._resource,
			options: {
				override: ZapFileEditorInput.typeId
			}
		};
	}
}
