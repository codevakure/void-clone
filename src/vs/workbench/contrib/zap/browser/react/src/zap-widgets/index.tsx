import { mountFnGenerator } from '../util/mountFnGenerator.js';
import { ZapButton } from './ZapButton.js';
import { ZapHeader } from './ZapHeader.js';

export const mountZapButton = mountFnGenerator(ZapButton);
export const mountZapHeader = mountFnGenerator(ZapHeader);
