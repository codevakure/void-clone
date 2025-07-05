/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

export class ReactZapIntegration {
	private reactRoot: { dispose: () => void } | null = null;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	async renderZapInterface(container: HTMLElement, zapContent?: string): Promise<void> {
		// Cleanup existing React root
		this.cleanup();

		try {
			// Import the playground component using relative path like VOID
			const zapPlayground = await import('./react/out/playground/index.js');

			// Create service accessor
			this.instantiationService.invokeFunction(accessor => {
				// Mount the ZapPlayground component
				const res = zapPlayground.mountZapPlayground(container, accessor, { zapContent });
				if (res) {
					this.reactRoot = res;
				}
			});
		} catch (error) {
			console.error('Error loading zap React component:', error);
			// Show fallback error message
			container.innerHTML = `
				<div style="color: var(--vscode-errorForeground); padding: 20px; text-align: center;">
					Failed to load zap React component. Please ensure it is built.
					<br><small>${error}</small>
				</div>
			`;
		}
	}

	cleanup(): void {
		if (this.reactRoot) {
			this.reactRoot.dispose();
			this.reactRoot = null;
		}
	}

	dispose(): void {
		this.cleanup();
	}
}
