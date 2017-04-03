import Ember from 'ember';
import BaseConsumer from 'ember-error-handler/consumer/wsod-consumer';
import {getRenderComponentFor} from '../utils/render-component';

const {$, getOwner, inject} = Ember;

export default BaseConsumer.extend({
	fastboot: inject.service(),

	init() {
		this._super(...arguments);
		this.set('renderComponent', getRenderComponentFor(this));
	},

	consume(descriptor) {
		const descriptors = this.get('descriptors');
		descriptors.pushObject(descriptor);

		if (this.get('fastboot.isFastBoot')) {
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

			const document = owner.lookup('service:-document');
			component.appendTo(document.body);
		} else {
			this.get('renderComponent')({
				name: this.get('component'),
				attrs: {
					descriptors
				},
				element: $('#ember-container')[0]
			});
		}

		return true;
	}
});
