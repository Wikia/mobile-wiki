import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

const {$, A, Component, computed} = Ember;

export default Component.extend({
	classNames: ['post-images'],

	/**
	 * @public
	 * @type {Ember.Array}
	 *
	 * Array containing images objects
	 */
	images: A(),

	/**
	 * @public
	 * @type {String}
	 *
	 * Component supports two modes:
	 * - 'compact' - shows only first image
	 * - 'full' - shows all images and displays image lightbox when image is clicked
	 */
	mode: 'compact',

	/**
	 * @private
	 */
	computeImagesToDisplay(images) {
		return this.get('mode') === 'compact' ? images.slice(0, 1) : images;
	},

	/**
	 * @private
	 */
	displayedImages: computed('showOnlyFirst', 'images', function () {
		const images = this.get('images'),
			noImages = A();

		return Ember.isEmpty(images) ? noImages : this.computeImagesToDisplay(images);
	}),

	enableLightbox: computed.equal('mode', 'full'),

	actions: {
		onLightboxClose() {
			track(trackActions.PostLightboxOverlayClose);
		},

		onLightboxCloseUsingButton() {
			track(trackActions.PostLightboxButtonClose);
		},

		onLightboxOpen() {
			track(trackActions.PostLightboxOpen);
		}
	}
});
