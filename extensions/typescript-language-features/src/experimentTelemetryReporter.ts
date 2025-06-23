/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import VsCodeTelemetryReporter from '@vscode/extension-telemetry';
import * as vscode from 'vscode';
// PROPRIETARY_API_REMOVED: Microsoft TAS client removed - see PROPRIETARY_APIS_REMOVED.md
// import * as tas from 'vscode-tas-client';

// Open-source compatible interface replacement
interface IExperimentationTelemetry {
	postEventObj(eventName: string, props: { [prop: string]: string }): void;
}

export interface IExperimentationTelemetryReporter extends IExperimentationTelemetry, vscode.Disposable {
	postEventObj(eventName: string, props: { [prop: string]: string }): void;
}

/**
 * This reporter *supports* experimentation telemetry,
 * but will only do so when passed to an {@link ExperimentationService}.
 */

export class ExperimentationTelemetryReporter implements IExperimentationTelemetryReporter {

	private _sharedProperties: Record<string, string> = {};
	private readonly _reporter: VsCodeTelemetryReporter;

	constructor(reporter: VsCodeTelemetryReporter) {
		this._reporter = reporter;
	}

	setSharedProperty(name: string, value: string): void {
		this._sharedProperties[name] = value;
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const propsObject = {
			...this._sharedProperties,
			...Object.fromEntries(props),
		};
		this._reporter.sendTelemetryEvent(eventName, propsObject);
	}

	postEventObj(eventName: string, props: { [prop: string]: string }) {
		this._reporter.sendTelemetryEvent(eventName, {
			...this._sharedProperties,
			...props,
		});
	}

	dispose() {
		this._reporter.dispose();
	}
}

