import Service from '@ember/service';
import NoScrollMixin from '../mixins/no-scroll';

export default Service.extend(NoScrollMixin, {
	closeButtonDelay: 0,
	file: null,
	isVisible: false,
	lightboxType: null,
	model: null,

	/**
	 * Sets controller properties that are passed to LightboxWrapperComponent.
	 * Also blocks scrolling.
	 *
	 * @param {string} lightboxType
	 * @param {Object} [lightboxModel]
	 * @param {number} [closeButtonDelay]
	 * @returns {void}
	 */
	open(lightboxType, lightboxModel, closeButtonDelay) {
		this.setProperties({
			closeButtonDelay,
			lightboxType,
			isVisible: true,
			model: lightboxModel,
			noScroll: true
		});
	},

	/**
	 * Sets lightbox visibility to true.
	 *
	 * @returns {void}
	 */
	show() {
		this.setProperties({
			isVisible: true,
			noScroll: true
		});
	},

	/**
	 * Resets properties related to lightbox which causes it to close. Also unblocks scrolling.
	 *
	 * @returns {void}
	 */
	close() {
		this.setProperties({
			closeButtonDelay: 0,
			file: null,
			isVisible: false,
			lightboxType: null,
			model: null,
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
	createHidden(lightboxType, lightboxModel, closeButtonDelay) {
		this.setProperties({
			closeButtonDelay,
			isVisible: false,
			lightboxType,
			model: lightboxModel,
			noScroll: false
		});
	}
});
