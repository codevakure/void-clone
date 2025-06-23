/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally used Microsoft's proprietary TAS (Treatment Assignment Service)
// for A/B testing and experimentation. This has been replaced with placeholder code
// to maintain the interface while avoiding proprietary dependencies.
//
// ALTERNATIVE OPEN SOURCE A/B TESTING SOLUTIONS:
// 1. Unleash - Open source feature toggle service (https://www.getunleash.io/)
// 2. Flagsmith - Open source feature flag management (https://flagsmith.com/)
// 3. PostHog - Feature flags + analytics (https://posthog.com/feature-flags)
// 4. Custom feature flags - Implement your own feature flag system
//
// TO IMPLEMENT CUSTOM FEATURE FLAGS:
// - Replace PlaceholderTASClient with your own feature flag service
// - Implement configuration-based feature flags using settings
// - Consider using environment variables for feature toggles

import { TelemetryLevel } from '../../telemetry/common/telemetry.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IProductService } from '../../product/common/productService.js';
import { getTelemetryLevel } from '../../telemetry/common/telemetryUtils.js';
import { IAssignmentService } from './assignment.js';
import { IEnvironmentService } from '../../environment/common/environment.js';

// Placeholder interfaces to maintain compatibility
export interface IExperimentationTelemetry {
	setSharedProperty(name: string, value: string): void;
	postEvent(eventName: string, props: Map<string, string>): void;
}

export interface IKeyValueStorage {
	getValue<T>(key: string, defaultValue?: T): Promise<T | undefined>;
	setValue<T>(key: string, value: T): void;
}

// Placeholder TAS Client
class PlaceholderTASClient {
	async initializePromise(): Promise<void> {
		return Promise.resolve();
	}

	get initialFetch(): Promise<void> {
		return Promise.resolve();
	}

	async getTreatmentVariableAsync<T extends string | number | boolean>(
		configId: string,
		name: string,
		checkCache?: boolean
	): Promise<T | undefined> {
		// DEVELOPER NOTE: Implement your feature flag logic here
		// This is a placeholder that always returns undefined
		return undefined;
	}
}

export abstract class BaseAssignmentService implements IAssignmentService {
	_serviceBrand: undefined;
	protected tasClient: Promise<PlaceholderTASClient> | undefined;
	private networkInitialized = false;
	private overrideInitDelay: Promise<void>;

	protected get experimentsEnabled(): boolean {
		return true;
	}

	constructor(
		//private readonly machineId: string,
		protected readonly configurationService: IConfigurationService,
		protected readonly productService: IProductService,
		protected readonly environmentService: IEnvironmentService,
		protected telemetry: IExperimentationTelemetry,
		//private keyValueStorage?: IKeyValueStorage
	) {
		const isTesting = environmentService.extensionTestsLocationURI !== undefined;

		// DEVELOPER NOTE: Original code checked for productService.tasConfig
		// Since we removed TAS, we now use configuration-based feature flags
		if (!isTesting && this.experimentsEnabled && getTelemetryLevel(this.configurationService) === TelemetryLevel.USAGE) {
			this.tasClient = this.setupPlaceholderClient();
		}

		// For development purposes, configure the delay until local treatment overrides are available
		const overrideDelaySetting = this.configurationService.getValue('experiments.overrideDelay');
		const overrideDelay = typeof overrideDelaySetting === 'number' ? overrideDelaySetting : 0;
		this.overrideInitDelay = new Promise(resolve => setTimeout(resolve, overrideDelay));
	}

	async getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined> {
		// For development purposes, allow overriding assignments to test variants locally.
		await this.overrideInitDelay;
		const override = this.configurationService.getValue<T>('experiments.override.' + name);
		if (override !== undefined) {
			return override;
		}

		// DEVELOPER NOTE: Original code used TAS service
		// Now we use configuration-based feature flags
		const configBasedValue = this.configurationService.getValue<T>('features.' + name);
		if (configBasedValue !== undefined) {
			return configBasedValue;
		}

		if (!this.tasClient) {
			return undefined;
		}

		if (!this.networkInitialized) {
			return undefined;
		}

		const client = await this.tasClient;
		return client.getTreatmentVariableAsync(name, name, true);
	}

	private async setupPlaceholderClient(): Promise<PlaceholderTASClient> {
		// DEVELOPER NOTE: This is a placeholder implementation
		// Replace with your preferred feature flag service

		const client = new PlaceholderTASClient();
		await client.initializePromise();
		client.initialFetch.then(() => this.networkInitialized = true);

		return client;
	}
}
