import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

const {A, Component, computed} = Ember;

export default Component.extend({
	classNames: ['post-images'],

	/**
	 * @public
	 * @type {Ember.Array}
	 *
	 * Array containing images objects
	 */
	images: null,

	/**
	 * @public
	 * @type {String}
	 *
	 * Component supports two modes:
	 * - 'compact' - shows only first image
	 * - 'edit' - shows all images and adds trash icon
	 * - 'full' - shows all images and displays image lightbox when image is clicked
	 */
	mode: 'compact',

	/**
	 * @private
	 */
	areEditorToolsVisible: computed.equal('mode', 'edit'),

	/**
	 * @private
	 */
	displayedImages: computed('images', function () {
		const images = this.get('images'),
			noImages = new A();

		return Ember.isEmpty(images) ? noImages : this.computeImagesToDisplay(images);
	}),

	/**
	 * @private
	 */
	enableLightbox: computed.equal('mode', 'full'),

	/**
	 * @private
	 */
	computeImagesToDisplay(images) {
		return this.get('mode') === 'compact' ? images.slice(0, 1) : images;
	},

	actions: {
		onLightboxClose() {
			track(trackActions.PostLightboxOverlayClose);
		},

		onLightboxCloseUsingButton() {
			track(trackActions.PostLightboxButtonClose);
		},

		onLightboxCloseUsingKey() {
			track(trackActions.PostLightboxKeyClose);
		},

		onLightboxOpen() {
			track(trackActions.PostLightboxOpen);
		}
	}
});
