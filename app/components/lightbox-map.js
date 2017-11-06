import {scheduleOnce} from '@ember/runloop';
import {observer} from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: observer('model', function () {
		this.updateState();
	}),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		// this.updateState modifies header and footer rendered in LightboxWrapperComponent
		// This isn't allowed by Ember to do on didInsertElement
		// That's why we need to schedule it in the afterRender queue
		scheduleOnce('afterRender', this, () => {
			this.updateState();
		});
	},

	/**
	 * @returns {void}
	 */
	updateState() {
		const model = this.get('model');

		this.sendAction('setHeader', model.title);
		this.sendAction('setQueryParam', 'map', model.id);
	},
});
