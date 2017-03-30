import Ember from 'ember';
const {Mixin, getOwner, inject} = Ember;

export default Mixin.create({
	fastboot: inject.service(),
	wikiVariables: inject.service(),

	afterModel(model, transition) {
		this._super(...arguments);

		if (!this.get('fastboot.isFastBoot')) {
			return;
		}

		// Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts
		const applicationInstance = getOwner(this);
		const document = applicationInstance.lookup('service:-document');
		const headBottomComponent = applicationInstance.lookup('component:fastboot-only/head-bottom');
		const bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');
		const wikiVariables = this.get('wikiVariables');

		headBottomComponent.appendTo(document.head);

		bodyBottomComponent.setProperties({
			queryParams: transition.queryParams
		});

		bodyBottomComponent.appendTo(document.body);
	}
});
