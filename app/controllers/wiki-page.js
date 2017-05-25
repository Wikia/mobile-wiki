import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	actions: {
		/**
		 *
		 * @param {string} lightboxType
		 * @param {*} lightboxModel
		 * @param {number} closeButtonDelay
		 */
		openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
			this.set('preserveScrollPosition', true);
			this.get('application').send('openLightbox', lightboxType, lightboxModel, closeButtonDelay);
		}
	}
});
