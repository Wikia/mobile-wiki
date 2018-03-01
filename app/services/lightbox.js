import Service from '@ember/service';

export default Service.extend({
	lightboxCloseButtonDelay: 0,
	lightboxModel: null,
	lightboxType: null,
	lightboxVisible: false,
	noScroll: false,

	/**
	 * Sets controller properties that are passed to LightboxWrapperComponent.
	 * Also blocks scrolling.
	 *
	 * @param {string} lightboxType
	 * @param {Object} [lightboxModel]
	 * @param {number} [closeButtonDelay]
	 * @returns {void}
	 */
	openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
		this.setProperties({
			lightboxModel,
			lightboxType,
			lightboxVisible: true,
			lightboxCloseButtonDelay: closeButtonDelay,
			noScroll: true
		});
	},

	/**
	 * Sets lightbox visibility to true.
	 *
	 * @returns {void}
	 */
	showLightbox() {
		this.setProperties({
			lightboxVisible: true,
			noScroll: true
		});
	},

	/**
	 * Resets properties related to lightbox which causes it to close. Also unblocks scrolling.
	 *
	 * @returns {void}
	 */
	closeLightbox() {
		this.setProperties({
			lightboxModel: null,
			lightboxType: null,
			lightboxVisible: false,
			lightboxCloseButtonDelay: 0,
			// TODO: is it needed at all?
			file: null,
			noScroll: false
		});
	},

	/**
	 * Sets lightbox type and model but doesn't show it. This method is used by Ads Module to
	 * prevent showing lightbox when there is no ad to display.
	 *
	 * @param {string} lightboxType
	 * @param {Object} [lightboxModel]
	 * @param {number} [closeButtonDelay]
	 * @returns {void}
	 */
	createHiddenLightbox(lightboxType, lightboxModel, closeButtonDelay) {
		this.setProperties({
			lightboxModel,
			lightboxType,
			lightboxVisible: false,
			lightboxCloseButtonDelay: closeButtonDelay,
			noScroll: false
		});
	},
});
