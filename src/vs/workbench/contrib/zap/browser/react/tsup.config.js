import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'./src/zap-widgets/index.tsx',
	],
	outDir: '../../../../../../../out/vs/workbench/contrib/zap/browser/react/out',
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
	treeshake: true,
	esbuildOptions(options) {
		options.outbase = 'src'  // tries copying the folder hierarchy starting at src
	}
});
