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
	 */
	imageUrl: null,

	actions: {
		/**
		 * @private
		 *
		 * Closes overlay
		 * @param {String} origin - action origin, 'overlay' or 'button'
		 */
		close(origin) {
			const onClose = this.get('onClose'),
				onButtonClose = this.get('onButtonClose');

			if (origin === 'overlay') {
				if (onClose) {
					onClose();
				}
			} else {
				if (onButtonClose) {
					onButtonClose();
				}
			}

			this.set('active', false);
			$('body').removeClass('lightbox-active');
		},

		/**
		 * @private
		 *
		 * Adds overlay and shows image
		 */
		open() {
			const onOpen = this.get('onOpen');
			if (onOpen) {
				onOpen();
			}
			this.set('active', true);
			$('body').addClass('lightbox-active');
		}
	}
});
