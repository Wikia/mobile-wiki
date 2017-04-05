import Ember from 'ember';
import BaseConsumer from 'ember-error-handler/consumer/wsod-consumer';

const {getOwner, inject} = Ember;

export default BaseConsumer.extend({
	fastboot: inject.service(),

	consume(descriptor) {
		// We don't want to display White Screen of Death in browser
		// We have too many external scripts that like to fail (ads, tracking)
		if (!this.get('fastboot.isFastBoot')) {
			return true;
		}

		const descriptors = this.get('descriptors');
		descriptors.pushObject(descriptor);

		let lookupKey;
		const owner = getOwner(this);

		lookupKey = 'component:' + this.get('component');
		const component = owner.lookup(lookupKey);
		if (!component) {
			throw Error(`Cannot instantiate wsod component '${lookupKey}'`);
		}

		lookupKey = 'template:components/' + this.get('component');
		const layout = owner.lookup(lookupKey);
		component.set('descriptors', descriptors);
		if (layout) {
			component.set('layout', layout);
		}

		component.appendTo(owner.lookup('service:-document').body);

		return true;
	}
});
