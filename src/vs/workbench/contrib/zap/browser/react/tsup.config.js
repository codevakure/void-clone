import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'./src/playground/index.tsx',
		'./src/url-box/index.tsx',
		'./src/payload-form/index.tsx',
		'./src/response-viewer/index.tsx',
	],
	outDir: './out',
	format: ['esm'],
	splitting: false,
	clean: false,
	platform: 'browser',
	target: 'esnext',
	injectStyle: true,
	outExtension: () => ({ js: '.js' }),
	noExternal: [
		/^(?!\.).*$/
	],
	external: [
		new RegExp('../../../*.js'
			.replaceAll('.', '\\.')
			.replaceAll('*', '.*'))
	],
	treeshake: true
});
