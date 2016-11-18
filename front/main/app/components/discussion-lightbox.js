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

	didRender() {
		this._super(arguments);
		this.$().find('.lightbox-overlay').focus();
	},

	keyDown(event) {
		// ESC press
		if (event.keyCode === 27) {
			this.send('close', 'key')
		}
	},

	actions: {
		/**
		 * @private
		 *
		 * Closes overlay
		 * @param {String} origin - action origin: 'overlay', 'button', 'key'
		 */
		close(origin) {
			const onClose = this.get('onClose'),
				onButtonClose = this.get('onButtonClose'),
				onKeyClose = this.get('onKeyClose');

			if (origin === 'overlay') {
				if (onClose) {
					onClose();
				}
			} else if (origin === 'button') {
				if (onButtonClose) {
					onButtonClose();
				}
			} else {
				if (onKeyClose) {
					onKeyClose();
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
