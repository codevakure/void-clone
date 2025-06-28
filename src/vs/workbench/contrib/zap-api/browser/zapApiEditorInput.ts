/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { EditorInputCapabilities, IUntypedEditorInput, Verbosity } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ZapRequest } from '../common/zapApiTypes.js';

export interface ZapApiEditorInputOptions {
	readonly request: ZapRequest;
	readonly collectionId: string;
}

/**
 * Editor input for Zap API requests that opens in the main editor area
 */
export class ZapApiEditorInput extends EditorInput {

	public static readonly typeId = 'workbench.editors.zapApiEditor';

	private static readonly scheme = 'zap-api';

	public readonly request: ZapRequest;
	public readonly collectionId: string;
	private readonly _resource: URI;

	public static create(
		instantiationService: IInstantiationService,
		options: ZapApiEditorInputOptions
	): ZapApiEditorInput {
		return instantiationService.createInstance(ZapApiEditorInput, options);
	}

	constructor(
		options: ZapApiEditorInputOptions
	) {
		super();
		this.request = options.request;
		this.collectionId = options.collectionId;

		// Create a unique URI for this request with .bru extension
		this._resource = URI.from({
			scheme: ZapApiEditorInput.scheme,
			authority: this.collectionId,
			path: `/${this.request.id}.bru`,
			query: JSON.stringify({
				requestId: this.request.id,
				collectionId: this.collectionId,
				method: this.request.method,
				name: this.request.name
			})
		});
	}

	public override get typeId(): string {
		return ZapApiEditorInput.typeId;
	}

	public override get capabilities(): EditorInputCapabilities {
		return EditorInputCapabilities.Readonly | EditorInputCapabilities.Singleton;
	}

	public override get resource(): URI {
		return this._resource;
	}

	public override getName(): string {
		return `${this.request.method} ${this.request.name}`;
	}

	public override getDescription(verbosity?: Verbosity): string | undefined {
		switch (verbosity) {
			case Verbosity.SHORT:
				return this.request.url || 'API Request';
			case Verbosity.MEDIUM:
				return `${this.request.method} ${this.request.url || 'API Request'}`;
			case Verbosity.LONG:
				return `${this.request.method} ${this.request.url || 'API Request'} - ${this.collectionId}`;
			default:
				return this.request.url || 'API Request';
		}
	}

	public override getTitle(verbosity?: Verbosity): string {
		return this.getName();
	}

	public override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (otherInput === this) {
			return true;
		}

		if (otherInput instanceof ZapApiEditorInput) {
			return this.request.id === otherInput.request.id &&
				this.collectionId === otherInput.collectionId;
		}

		return false;
	}

	public override toUntyped(): IUntypedEditorInput {
		return {
			resource: this.resource,
			options: {
				override: ZapApiEditorInput.typeId
			}
		};
	}
}
