/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Void Editor Contributors. All rights reserved.
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import { spawn } from 'cross-spawn'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function doesPathExist(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return stats.isFile();
	} catch (err) {
		if (err.code === 'ENOENT') {
			return false;
		}
		throw err;
	}
}

// Build once
async function buildOnce() {
	console.log('🔄 Building Zap API React components...');

	// Run scope-tailwind to process Tailwind classes
	console.log('📦 Running scope-tailwind...');
	const scopeTailwindProcess = spawn('npx', [
		'scope-tailwind',
		'./src',
		'-o', 'src2/',
		'-s', 'void-scope',
		'-c', 'styles.css',
		'-p', 'void-'
	], { stdio: 'inherit' });

	await new Promise((resolve, reject) => {
		scopeTailwindProcess.on('close', (code) => {
			if (code === 0) {
				console.log('✅ scope-tailwind completed');
				resolve();
			} else {
				console.error('❌ scope-tailwind failed');
				reject(new Error(`scope-tailwind process exited with code ${code}`));
			}
		});
	});

	// Run tsup to build TypeScript
	console.log('📦 Running tsup...');
	const tsupProcess = spawn('npx', ['tsup'], { stdio: 'inherit' });

	await new Promise((resolve, reject) => {
		tsupProcess.on('close', (code) => {
			if (code === 0) {
				console.log('✅ tsup build completed');
				resolve();
			} else {
				console.error('❌ tsup build failed');
				reject(new Error(`tsup process exited with code ${code}`));
			}
		});
	});

	console.log('✅ Zap API React build complete!');
}

// Watch mode
function buildWatch() {
	console.log('🔄 Starting Zap API React watch mode...');

	// Start scope-tailwind watcher
	const scopeTailwindWatcher = spawn('npx', [
		'nodemon',
		'--watch', './src',
		'--ext', 'ts,tsx,css',
		'--exec',
		'npx scope-tailwind ./src -o src2/ -s void-scope -c styles.css -p "void-"'
	]);

	// Start tsup watcher
	const tsupWatcher = spawn('npx', [
		'tsup',
		'--watch'
	]);

	scopeTailwindWatcher.stdout.on('data', (data) => {
		console.log(`[scope-tailwind] ${data}`);
	});

	scopeTailwindWatcher.stderr.on('data', (data) => {
		console.error(`[scope-tailwind] ${data}`);
	});

	tsupWatcher.stdout.on('data', (data) => {
		console.log(`[tsup] ${data}`);
	});

	tsupWatcher.stderr.on('data', (data) => {
		console.error(`[tsup] ${data}`);
	});

	process.on('SIGINT', () => {
		scopeTailwindWatcher.kill();
		tsupWatcher.kill();
		process.exit();
	});
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--watch')) {
	buildWatch();
} else {
	buildOnce().catch(console.error);
}
