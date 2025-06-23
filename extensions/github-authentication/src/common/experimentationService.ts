/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * DEVELOPER NOTE: Microsoft Proprietary APIs Removed
 * ================================================
 * 
 * This file originally contained Microsoft's proprietary experimentation and telemetry services
 * including the 'vscode-tas-client' package. These have been commented out to create an
 * open-source compatible version.
 * 
 * Original functionality included:
 * - A/B testing and feature experimentation via Microsoft's TAS (Treatment Assignment Service)
 * - Proprietary telemetry collection for Microsoft's internal analytics
 * - Population targeting (Public, Insiders, Internal, Team)
 * 
 * For open-source distributions, these services are replaced with no-op implementations
 * to maintain API compatibility while removing proprietary dependencies.
 * 
 * If you need experimentation or telemetry features, consider:
 * - Implementing your own A/B testing framework
 * - Using open-source analytics solutions
 * - Creating custom feature flag systems
 */

import * as vscode from 'vscode';
import TelemetryReporter from '@vscode/extension-telemetry';

// COMMENTED OUT: Microsoft proprietary experimentation service
// import { getExperimentationService, IExperimentationService, IExperimentationTelemetry, TargetPopulation } from 'vscode-tas-client';

// Stub interfaces to maintain API compatibility without proprietary dependencies
interface IExperimentationTelemetry {
	sendTelemetryEvent(eventName: string, properties?: Record<string, string>, measurements?: Record<string, number>): Promise<void>;
	sendTelemetryErrorEvent(eventName: string, properties?: Record<string, string>, measurements?: Record<string, number>): Promise<void>;
	setSharedProperty(name: string, value: string): void;
	postEvent(eventName: string, props: Map<string, string>): void;
	dispose(): Promise<any>;
}

// REMOVED: Unused proprietary interfaces and enums
// - IExperimentationService: Microsoft's TAS service interface
// - TargetPopulation: Enum for Microsoft's user population targeting

export class ExperimentationTelemetry implements IExperimentationTelemetry {
	private sharedProperties: Record<string, string> = {};
	/**
	 * DEVELOPER NOTE: Simplified Constructor
	 * =====================================
	 * 
	 * The context parameter is maintained for API compatibility but is no longer
	 * used since we've removed the proprietary Microsoft experimentation service
	 * that required extension context for state management.
	 */
	constructor(_context: vscode.ExtensionContext, private baseReporter: TelemetryReporter) { 
		// Context parameter kept for API compatibility but not used in simplified implementation
	}

	// REMOVED: Proprietary experimentation service initialization
	// Original method: createExperimentationService() - created Microsoft's TAS client
	/**
	 * DEVELOPER NOTE: Simplified Telemetry Implementation
	 * ==================================================
	 * 
	 * This method originally integrated with Microsoft's proprietary experimentation service
	 * for advanced A/B testing and feature flagging. The implementation has been simplified
	 * to use only the base telemetry reporter without proprietary dependencies.
	 * 
	 * Original behavior:
	 * - Waited for experimentation service initialization
	 * - Applied experiment-specific properties and measurements
	 * - Sent data to Microsoft's TAS backend
	 * 
	 * Current behavior:
	 * - Sends telemetry directly via base reporter
	 * - Maintains API compatibility for existing code
	 * - No dependency on proprietary Microsoft services
	 * 
	 * @returns A promise that you shouldn't need to await because this is just telemetry.
	 */
	async sendTelemetryEvent(eventName: string, properties?: Record<string, string>, measurements?: Record<string, number>) {
		// SIMPLIFIED: Direct telemetry without proprietary experimentation service
		// Original code waited for experimentationServicePromise initialization
		
		this.baseReporter.sendTelemetryEvent(
			eventName,
			{
				...this.sharedProperties,
				...properties,
			},
			measurements,
		);
	}

	/**
	 * DEVELOPER NOTE: Simplified Error Telemetry
	 * ==========================================
	 * 
	 * Similar to sendTelemetryEvent, this has been simplified to remove
	 * dependencies on Microsoft's proprietary experimentation service.
	 * 
	 * @returns A promise that you shouldn't need to await because this is just telemetry.
	 */
	async sendTelemetryErrorEvent(
		eventName: string,
		properties?: Record<string, string>,
		_measurements?: Record<string, number>
	) {
		// SIMPLIFIED: Direct error telemetry without proprietary experimentation service
		
		this.baseReporter.sendTelemetryErrorEvent(eventName, {
			...this.sharedProperties,
			...properties,
		});
	}
	setSharedProperty(name: string, value: string): void {
		this.sharedProperties[name] = value;
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const event: Record<string, string> = {};
		for (const [key, value] of props) {
			event[key] = value;
		}
		this.sendTelemetryEvent(eventName, event);
	}

	dispose(): Promise<any> {
		return this.baseReporter.dispose();
	}
}

/**
 * DEVELOPER SUMMARY: Microsoft Proprietary APIs Removed
 * =====================================================
 * 
 * This file has been modified to remove dependencies on Microsoft's proprietary
 * experimentation and telemetry services, specifically:
 * 
 * REMOVED DEPENDENCIES:
 * - 'vscode-tas-client' package (Microsoft's Treatment Assignment Service)
 * - getExperimentationService() function
 * - IExperimentationService interface 
 * - TargetPopulation enum
 * 
 * MAINTAINED FUNCTIONALITY:
 * - Basic telemetry reporting via @vscode/extension-telemetry
 * - API compatibility for existing consumers
 * - Shared property management
 * - Event posting and error reporting
 * 
 * This creates a clean, open-source compatible implementation that maintains
 * the same external API while removing proprietary Microsoft services.
 * 
 * For developers: If you need advanced experimentation features, consider
 * implementing your own A/B testing framework or using open-source alternatives.
 */
