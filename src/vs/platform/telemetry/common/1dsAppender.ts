/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally used Microsoft's proprietary 1DS (One Data Strategy) telemetry service
// which sends data to Microsoft's servers. This has been replaced with placeholder code
// to maintain the interface while avoiding proprietary dependencies.
//
// ALTERNATIVE OPEN SOURCE TELEMETRY SOLUTIONS:
// 1. PostHog - Open source product analytics (https://posthog.com)
// 2. Plausible Analytics - Privacy-focused analytics (https://plausible.io)
// 3. Matomo - Open source web analytics (https://matomo.org)
// 4. Custom telemetry endpoint - Implement your own telemetry collection
//
// TO IMPLEMENT CUSTOM TELEMETRY:
// - Replace the endpoint URL with your own telemetry service
// - Implement your own telemetry appender following the ITelemetryAppender interface
// - Consider user privacy and make telemetry opt-in

import { onUnexpectedError } from '../../../base/common/errors.js';
import { mixin } from '../../../base/common/objects.js';
import { ITelemetryAppender, validateTelemetryData } from './telemetryUtils.js';

// Placeholder interface for telemetry item
export interface ITelemetryItem {
	name: string;
	data?: any;
	timestamp?: number;
}

// Placeholder interface for telemetry unload state
export interface ITelemetryUnloadState {
	reason: string;
}

// Simplified interface for telemetry core
export interface IAppInsightsCore {
	pluginVersionString: string;
	track(item: ITelemetryItem): void;
	unload(isAsync: boolean, unloadComplete: (unloadState: ITelemetryUnloadState) => void): void;
}

// DEVELOPER NOTE: Replace this with your own telemetry endpoint
// const endpointUrl = 'https://your-telemetry-service.com/collect';

async function getClient(instrumentationKey: string, addInternalFlag?: boolean, xhrOverride?: any): Promise<IAppInsightsCore> {
	// DEVELOPER NOTE: This is a placeholder implementation
	// Replace with your preferred telemetry client initialization
	return {
		pluginVersionString: 'void-telemetry-placeholder-1.0.0',
		track: (item: ITelemetryItem) => {
			// DEVELOPER NOTE: Implement your telemetry collection logic here
			// Example: Send to your own analytics service
			console.log('[VOID TELEMETRY PLACEHOLDER]', item);
		},
		unload: (isAsync: boolean, unloadComplete: (unloadState: ITelemetryUnloadState) => void) => {
			unloadComplete({ reason: 'placeholder' });
		}
	};
}

export abstract class AbstractOneDataSystemAppender implements ITelemetryAppender {

	protected _aiCoreOrKey: IAppInsightsCore | string | undefined;
	private _asyncAiCore: Promise<IAppInsightsCore> | null;

	constructor(
		private readonly _isInternalTelemetry: boolean,
		private _eventPrefix: string,
		private _defaultData: { [key: string]: any } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
		private _xhrOverride?: any
	) {
		if (!this._defaultData) {
			this._defaultData = {};
		}

		if (typeof iKeyOrClientFactory === 'function') {
			this._aiCoreOrKey = iKeyOrClientFactory();
		} else {
			this._aiCoreOrKey = iKeyOrClientFactory;
		}
		this._asyncAiCore = null;
	}

	private _withAIClient(callback: (aiCore: IAppInsightsCore) => void): void {
		if (!this._aiCoreOrKey) {
			return;
		}

		if (typeof this._aiCoreOrKey !== 'string') {
			callback(this._aiCoreOrKey);
			return;
		}

		if (!this._asyncAiCore) {
			this._asyncAiCore = getClient(this._aiCoreOrKey, this._isInternalTelemetry, this._xhrOverride);
		}

		this._asyncAiCore.then(
			(aiClient) => {
				callback(aiClient);
			},
			(err) => {
				onUnexpectedError(err);
				console.error(err);
			}
		);
	}

	log(eventName: string, data?: any): void {
		if (!this._aiCoreOrKey) {
			return;
		}
		data = mixin(data, this._defaultData);
		data = validateTelemetryData(data);
		const name = this._eventPrefix + '/' + eventName;

		try {
			this._withAIClient((aiClient) => {
				aiClient.pluginVersionString = data?.properties?.version ?? 'Unknown';
				aiClient.track({
					name,
					data: { name, properties: data?.properties, measurements: data?.measurements }
				});
			});
		} catch { 
			// DEVELOPER NOTE: Telemetry tracking failed - implement error handling as needed
		}
	}

	flush(): Promise<void> {
		// DEVELOPER NOTE: Implement telemetry flushing if using a custom telemetry service
		return Promise.resolve();
	}

	dispose(): Promise<void> {
		return new Promise(resolve => {
			if (!this._aiCoreOrKey) {
				resolve();
				return;
			}
			this._withAIClient((aiClient) => {
				aiClient.unload(true, () => {
					this._aiCoreOrKey = undefined;
					resolve();
				});
			});
		});
	}
}
