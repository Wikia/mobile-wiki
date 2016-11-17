import Ember from 'ember';

const {$, Component} = Ember;

export default Component.extend({
	/**
	 * @private
	 */
	active: false,

	/**
	 * @public
	 * Called when closing lightbox - clicked on overlay.
	 */
	onClose: null,

	/**
	 * @public
	 * Called when closing lightbox - clicked on button.
	 */
	onButtonClose: null,

	/**
	 * @public
	 * Called when opening lightbox.
	 */
	onOpen: null,

	/**
	 * @public
	 * @type {String}
	 *
	 * Image url.
	 */
	url: null,

	/**
	 * @private
	 */
	closeOverlay() {
		this.set('active', false);
		$('body').removeClass('lightbox-active');
	},

	actions: {
		/**
		 * @private
		 *
		 * Closes overlay when clicked on overlay
		 */
		close() {
			if (this.get('onClose')) {
				this.get('onClose')();
			}
			this.closeOverlay();
		},

		/**
		 * @private
		 *
		 * Closes overlay when clicked on button
		 */
		closeUsingButton() {
			if (this.get('onButtonClose')) {
				this.get('onButtonClose')();
			}
			this.closeOverlay();
		},

		/**
		 * @private
		 *
		 * Adds overlay and shows image
		 */
		open() {
			if (this.get('onOpen')) {
				this.get('onOpen')();
			}
			this.set('active', true);
			$('body').addClass('lightbox-active');
		}
	}
});
