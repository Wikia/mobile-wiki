import Controller, {inject as controller} from '@ember/controller';

export default Controller.extend({
	application: controller(),
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
