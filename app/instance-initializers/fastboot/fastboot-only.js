// Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts

export function initialize(applicationInstance) {
	const document = applicationInstance.lookup('service:-document');
	const headBottomComponent = applicationInstance.lookup('component:fastboot-only/head-bottom');

	if (headBottomComponent) {
		headBottomComponent.appendTo(document.head);
	}

	// TODO body-before-ember & body-bottom
}

export default {
	name: 'fastboot-only',
	// we want to append scripts below ember-cli-head's output
	after: 'head-fastboot',
	initialize
};
