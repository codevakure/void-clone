/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// VOID EDITOR DEVELOPER NOTE:
// This file originally contained Microsoft's proprietary 1DS (One Data Strategy) telemetry service
// implementation for Node.js. This has been replaced with a placeholder implementation.
//
// The original code included complex HTTP request handling and data transmission to Microsoft servers.
// This implementation provides the same interface but with no-op functionality.

import { AbstractOneDataSystemAppender, IAppInsightsCore } from '../common/1dsAppender.js';
import { IRequestService } from '../../request/common/request.js';

export class OneDataSystemAppender extends AbstractOneDataSystemAppender {

	constructor(
		requestService: IRequestService | undefined,
		isInternalTelemetry: boolean,
		eventPrefix: string,
		defaultData: { [key: string]: any } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
	) {
		super(isInternalTelemetry, eventPrefix, defaultData, iKeyOrClientFactory);

		// Void: No telemetry collection in Node.js
		console.log('[VOID TELEMETRY] Node.js telemetry disabled');
	}
}
