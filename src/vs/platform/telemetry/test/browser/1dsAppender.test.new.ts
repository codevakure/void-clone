/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally contained tests for Microsoft's proprietary 1DS (One Data Strategy) telemetry service.
// Since the telemetry functionality has been replaced with placeholder implementations,
// this test file now contains placeholder tests that validate the no-op behavior.

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OneDataSystemWebAppender } from '../../browser/1dsAppender.js';
import { IAppInsightsCore } from '../../common/1dsAppender.js';

class MockAppInsightsCore implements IAppInsightsCore {
	pluginVersionString: string = 'void-test-mock';
	public events: any[] = [];

	public track(item: any) {
		this.events.push(item);
	}

	public unload(isAsync: boolean, unloadComplete: (unloadState: any) => void): void {
		unloadComplete({ reason: 'mock-unload' });
	}
}

suite('OneDataSystemWebAppender - Void Placeholder Tests', () => {
	let mockCore: MockAppInsightsCore;
	let appender: OneDataSystemWebAppender;

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		mockCore = new MockAppInsightsCore();
		appender = new OneDataSystemWebAppender(false, 'test', null, () => mockCore);
	});

	teardown(async () => {
		if (appender) {
			await appender.dispose();
		}
	});

	test('OneDataSystemWebAppender instantiates without error', () => {
		assert.ok(appender, 'Appender should be created');
	});

	test('OneDataSystemWebAppender.log does not throw', () => {
		assert.doesNotThrow(() => appender.log('test-event', { data: 'test' }));
	});

	test('OneDataSystemWebAppender.flush returns resolved promise', async () => {
		const result = await appender.flush();
		assert.strictEqual(result, undefined, 'Flush should return undefined');
	});

	test('OneDataSystemWebAppender.dispose returns resolved promise', async () => {
		const result = await appender.dispose();
		assert.strictEqual(result, undefined, 'Dispose should return undefined');
	});

	test('Appender accepts different data types without error', () => {
		assert.doesNotThrow(() => {
			appender.log('test-event', {
				string: 'test',
				number: 42,
				boolean: true,
				date: new Date(),
				array: [1, 2, 3],
				object: { nested: 'value' }
			});
		});
	});
});
