/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ZapReactProvider } from './ZapReactProvider.js';
import { ZapApiMainApp } from './ZapApiMainApp.js';
import { ZapApiRequestEditorMain } from './ZapApiRequestEditorMain.js';
import { ZapRequest } from '../../../../common/zapApiTypes.js';

export const mountZapApi = (rootElement: HTMLElement) => {
	if (typeof document === 'undefined') {
		console.error('zap-api index.tsx error: document was undefined');
		return;
	}

	const root = createRoot(rootElement);

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

// Mount function for individual request editors
export const mountZapApiEditor = (rootElement: HTMLElement, options: { request: ZapRequest; collectionId: string }) => {
	if (typeof document === 'undefined') {
		console.error('zap-api index.tsx error: document was undefined');
		return;
	}

	const root = createRoot(rootElement);

	const rerender = () => {
		root.render(
			<React.StrictMode>
				<ZapApiRequestEditorMain
					request={options.request}
					collectionId={options.collectionId}
				/>
			</React.StrictMode>
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
