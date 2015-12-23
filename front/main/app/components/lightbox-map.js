import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Ember.observer('model', function () {
		this.updateState();
	}),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		// this.updateState modifies header and footer rendered in LightboxWrapperComponent
		// This isn't allowed by Ember to do on didInsertElement
		// That's why we need to schedule it in the afterRender queue
		Ember.run.scheduleOnce('afterRender', this, () => {
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
