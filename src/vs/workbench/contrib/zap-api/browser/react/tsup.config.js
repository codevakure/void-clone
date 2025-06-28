/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { defineConfig } from 'tsup'

export default defineConfig({
	entry: [
		'./src2/zap-api-tsx/index.tsx',
	],
	outDir: './out',
	format: ['esm'],
	splitting: false,

	// dts: true,
	// sourcemap: true,

	clean: false,
	platform: 'browser', // 'node'
	target: 'esnext',
	injectStyle: true, // bundle css into the output file
	outExtension: () => ({ js: '.js' }),
	// Bundle everything including React since VS Code doesn't have React available
	external: [],
	noExternal: [/.*/],

	// Add namespace isolation
	globalName: 'ZapApiReact',
	minify: false,
	keepNames: true,
})
