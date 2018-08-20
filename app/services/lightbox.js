import Service, { inject as service } from '@ember/service';
import NoScrollMixin from '../mixins/no-scroll';
import { track, trackActions } from '../utils/track';

export default Service.extend(NoScrollMixin, {
	preserveScroll: service(),
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
	 * @returns {void}
	 */
	open(lightboxType, lightboxModel) {
		this.setProperties({
			lightboxType,
			isVisible: true,
			model: lightboxModel,
			noScroll: true,
			'preserveScroll.preserveScrollPosition': true,
		});

		if (lightboxType === 'media') {
			track({
				action: trackActions.click,
				category: 'media',
				label: 'open'
			});

		}
	},

	/**
	 * Resets properties related to lightbox which causes it to close. Also unblocks scrolling.
	 *
	 * @returns {void}
	 */
	close() {
		this.setProperties({
			file: null,
			isVisible: false,
			lightboxType: null,
			model: null,
			noScroll: false
		});
	}
});
