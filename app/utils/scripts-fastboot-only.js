const {getOwner} = Ember;

/**
 * Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts
 *
 * @param {Ember.Route} parent
 */
export default function (parent, queryParams) {
	const applicationInstance = getOwner(parent);
	const document = applicationInstance.lookup('service:-document');
	const headBottomComponent = applicationInstance.lookup('component:fastboot-only/head-bottom');
	const bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');

	headBottomComponent.set('queryParams', queryParams);
	headBottomComponent.appendTo(document.head);

	// TODO body-before-ember

	bodyBottomComponent.set('queryParams', queryParams);
	bodyBottomComponent.appendTo(document.body);
}
