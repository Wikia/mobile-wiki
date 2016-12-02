import Ember from 'ember';

const {$, Component} = Ember;

export default Component.extend({
	/**
	 * @private
	 */
	active: false,

	/**
	 * @public
	 */
	image: null,

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
	 * @private
	 */
	yPosition: null,

	deactivateLightbox() {
		this.set('active', false);
		$('body').removeClass('lightbox-active');
	},

	didDestroyElement() {
		this._super(...arguments);

		this.deactivateLightbox();
	},

	didRender() {
		this._super(...arguments);

		this.$('.lightbox-overlay').focus();
	},

	keyDown(event) {
		// ESC press
		if (event.keyCode === 27) {
			this.send('close', 'key');
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

			this.deactivateLightbox();

			// Returns scroll to position before opening lightbox, fix for iOS
			$(window).scrollTop(this.get('yPosition'));
		},

		/**
		 * @private
		 * Ignore clicks on image
		 *
		 * @returns {boolean}
		 */
		imageClick() {
			return false;
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

			// Stores scroll position before opening lightbox, fix for iOS
			this.set('yPosition', $(window).scrollTop());

			this.set('active', true);
			$('body').addClass('lightbox-active');
		}
	}
});
