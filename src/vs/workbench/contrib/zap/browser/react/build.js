/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { execSync } from 'child_process';
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
	} catch (error) {
		return false;
	}
}

function runCommand(command, args, options = {}) {
	try {
		console.log(`Running: ${command} ${args.join(' ')}`);
		// Use execSync with proper cwd pointing to parent directory
		const parentDir = path.resolve(__dirname, '../../../../../../../');
		execSync(`${command} ${args.join(' ')}`, {
			stdio: 'inherit',
			cwd: __dirname,
			env: { ...process.env, PATH: `${path.join(parentDir, 'node_modules', '.bin')}${path.delimiter}${process.env.PATH}` },
			...options
		});
	} catch (error) {
		console.error(`Error running command: ${command} ${args.join(' ')}`);
		throw error;
	}
}

// Check if tsup is available in parent node_modules
const parentDir = path.resolve(__dirname, '../../../../../../../');
const tsupPath = path.join(parentDir, 'node_modules', '.bin', 'tsup');
const tsupCmdPath = path.join(parentDir, 'node_modules', '.bin', 'tsup.cmd');

if (!doesPathExist(tsupPath) && !doesPathExist(tsupCmdPath)) {
	console.error('tsup not found in parent node_modules. Please install it first.');
	process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');

try {
	if (isWatch) {
		console.log('Starting zap React build in watch mode...');
		runCommand('npx', ['tsup', '--watch']);
	} else {
		console.log('Building zap React components...');
		runCommand('npx', ['tsup']);
		console.log('Zap React build completed successfully!');
	}
} catch (error) {
	console.error('Build failed:', error);
	process.exit(1);
}
