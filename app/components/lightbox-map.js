import {scheduleOnce} from '@ember/runloop';
import {observer} from '@ember/object';
import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
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

		this.get('setHeader')(model.title);
		this.get('setQueryParam')('map', model.id);
	},
});
