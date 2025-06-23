/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally contained Microsoft's A/B testing and experimentation service (TAS - Treatment Assignment Service).
// This service was used to control feature rollouts and experiments by assigning users to different treatment groups.
// This has been replaced with a placeholder implementation that always returns undefined for all experiments.
//
// ALTERNATIVE EXPERIMENTATION SOLUTIONS:
// 1. Unleash - Open source feature flag service (https://www.getunleash.io/)
// 2. LaunchDarkly - Feature flag management (https://launchdarkly.com/)
// 3. GrowthBook - Open source experimentation platform (https://www.growthbook.io/)
// 4. Custom feature flag system - Implement your own feature toggle system

export const ASSIGNMENT_STORAGE_KEY = 'VSCode.ABExp.FeatureData';
export const ASSIGNMENT_REFETCH_INTERVAL = 0; // no polling

export interface IAssignmentService {
	readonly _serviceBrand: undefined;
	getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined>;
}

export enum TargetPopulation {
	Insiders = 'insider',
	Public = 'public',
	Exploration = 'exploration'
}

export enum Filters {
	Market = 'X-MSEdge-Market',
	CorpNet = 'X-FD-Corpnet',
	ApplicationVersion = 'X-VSCode-AppVersion',
	Build = 'X-VSCode-Build',
	ClientId = 'X-MSEdge-ClientId',
	ExtensionName = 'X-VSCode-ExtensionName',
	ExtensionVersion = 'X-VSCode-ExtensionVersion',
	Language = 'X-VSCode-Language',
	TargetPopulation = 'X-VSCode-TargetPopulation',
}

export class AssignmentFilterProvider {
	constructor(
		private version: string,
		private appName: string,
		private machineId: string,
		private targetPopulation: TargetPopulation
	) { }

	private static trimVersionSuffix(version: string): string {
		const regex = /\-[a-zA-Z0-9]+$/;
		const result = version.split(regex);
		return result[0];
	}

	getFilterValue(filter: string): string | null {
		// Void: Return placeholder values instead of real filter data
		switch (filter) {
			case Filters.ApplicationVersion:
				return AssignmentFilterProvider.trimVersionSuffix(this.version);
			case Filters.Build:
				return this.appName;
			case Filters.ClientId:
				return this.machineId;
			case Filters.Language:
				return 'en';
			case Filters.ExtensionName:
				return 'vscode-core';
			case Filters.ExtensionVersion:
				return '999999.0';
			case Filters.TargetPopulation:
				return this.targetPopulation;
			default:
				return '';
		}
	}

	getFilters(): Map<string, any> {
		const filters: Map<string, any> = new Map<string, any>();
		const filterValues = Object.values(Filters);
		for (const value of filterValues) {
			filters.set(value, this.getFilterValue(value));
		}
		return filters;
	}
}
