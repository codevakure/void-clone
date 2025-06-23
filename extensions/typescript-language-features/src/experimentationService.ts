/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
// PROPRIETARY_API_REMOVED: Microsoft TAS client removed - see PROPRIETARY_APIS_REMOVED.md
// import * as tas from 'vscode-tas-client';

// Open-source compatible interface replacement
interface IExperimentationService {
	getCachedFeatureFlag(name: string): boolean | undefined;
	getTreatmentVariable<T>(configId: string, name: string): Promise<T | undefined>;
	getTreatmentVariableAsync<T>(configId: string, name: string): Promise<T | undefined>;
	initializePromise: Promise<void>;
	initialFetch: Promise<void>;
}

import { IExperimentationTelemetryReporter } from './experimentTelemetryReporter';

interface ExperimentTypes {
	// None for now.
}

export class ExperimentationService {
	private readonly _experimentationServicePromise: Promise<IExperimentationService>;
	private readonly _telemetryReporter: IExperimentationTelemetryReporter;

	constructor(telemetryReporter: IExperimentationTelemetryReporter, id: string, version: string, globalState: vscode.Memento) {
		this._telemetryReporter = telemetryReporter;
		this._experimentationServicePromise = createTasExperimentationService(this._telemetryReporter, id, version, globalState);
	}

	public async getTreatmentVariable<K extends keyof ExperimentTypes>(name: K, defaultValue: ExperimentTypes[K]): Promise<ExperimentTypes[K]> {
		const experimentationService = await this._experimentationServicePromise;
		try {
			const treatmentVariable = experimentationService.getTreatmentVariableAsync('vscode', name) as Promise<ExperimentTypes[K]>;
			return treatmentVariable || defaultValue;
		} catch {
			return defaultValue;
		}
	}
}

// PROPRIETARY_API_REMOVED: Microsoft TAS service replaced with stub implementation
export async function createTasExperimentationService(
	_reporter: IExperimentationTelemetryReporter,
	_id: string,
	_version: string,
	_globalState: vscode.Memento): Promise<IExperimentationService> {
	
	// Stub implementation - returns default values for all experiments
	return {
		getCachedFeatureFlag: (_name: string) => undefined,
		getTreatmentVariable: async <T>(_configId: string, _name: string) => undefined as T | undefined,
		getTreatmentVariableAsync: async <T>(_configId: string, _name: string) => undefined as T | undefined,
		initializePromise: Promise.resolve(),
		initialFetch: Promise.resolve()
	};
}
