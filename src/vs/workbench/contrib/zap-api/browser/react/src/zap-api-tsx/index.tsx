/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ZapReactProvider } from './providers/ZapReactProvider.js';
import { ZapApiMainApp } from './ZapApiMainApp.js';
import { ZapApiRequestEditor } from './views/ZapApiRequestEditor.js';
import { ZapRequest } from '../../../../common/zapApiTypes.js';

// Store roots to avoid recreating them
const rootMap = new WeakMap<HTMLElement, Root>();

/**
 * Mount the Zap API side panel (collection tree only)
 */
export const mountZapApi = (rootElement: HTMLElement) => {
	if (typeof document === 'undefined') {
		console.error('zap-api index.tsx error: document was undefined');
		return;
	}

	let root = rootMap.get(rootElement);
	if (!root) {
		root = createRoot(rootElement);
		rootMap.set(rootElement, root);
	}

	const rerender = (props?: any) => {
		root.render(
			<ZapReactProvider {...props}>
				<ZapApiMainApp />
			</ZapReactProvider>
		);
	};

	const dispose = () => {
		root.unmount();
	};

	rerender();

	return {
		rerender,
		dispose,
	};
};

/**
 * Mount function for individual request editors in the main editor panel
 */
export const mountZapApiEditor = (rootElement: HTMLElement, options: { request: ZapRequest; collectionId: string }) => {
	if (typeof document === 'undefined') {
		console.error('zap-api index.tsx error: document was undefined');
		return;
	}

	let root = rootMap.get(rootElement);
	if (!root) {
		root = createRoot(rootElement);
		rootMap.set(rootElement, root);
	}

	const rerender = () => {
		root.render(
			<ZapReactProvider>
				<ZapApiRequestEditor
					request={options.request}
					collectionId={options.collectionId}
					mode="full"
				/>
			</ZapReactProvider>
		);
	};

	const dispose = () => {
		root.unmount();
	};

	rerender();

	return {
		rerender,
		dispose,
	};
};
