/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally contained Microsoft's proprietary 1DS (One Data Strategy) telemetry service
// implementation for the browser. This has been replaced with a placeholder implementation.

import { AbstractOneDataSystemAppender, IAppInsightsCore } from '../common/1dsAppender.js';

export class OneDataSystemWebAppender extends AbstractOneDataSystemAppender {
	constructor(
		isInternalTelemetry: boolean,
		eventPrefix: string,
		defaultData: { [key: string]: any } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
	) {
		super(isInternalTelemetry, eventPrefix, defaultData, iKeyOrClientFactory);
		
		// Void: No telemetry collection in browser
		console.log('[VOID TELEMETRY] Browser telemetry disabled');
	}
}
