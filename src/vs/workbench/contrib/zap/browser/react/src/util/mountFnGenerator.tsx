import React from 'react';
import * as ReactDOM from 'react-dom/client';

export const mountFnGenerator = (Component: React.ComponentType<any>) => (rootElement: HTMLElement, accessor?: any, props?: any) => {
	if (typeof document === 'undefined') {
		console.error('mountFnGenerator error: document was undefined');
		return;
	}

	const root = ReactDOM.createRoot(rootElement);

	const rerender = (props?: any) => {
		root.render(<Component {...props} />);
	};

	const dispose = () => {
		root.unmount();
	};

	rerender(props);

	const returnVal = {
		rerender,
		dispose,
	};
	return returnVal;
};
