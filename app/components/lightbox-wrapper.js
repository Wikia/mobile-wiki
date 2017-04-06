import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['isVisible:open'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,

	isVisible: false,
	closeButtonHidden: false,
	lightboxCloseButtonDelay: 0,
	footerExpanded: false,
	footerHidden: false,
	headerHidden: false,
	header: null,
	footer: null,

	type: null,
	model: null,

	lightboxComponent: Ember.computed('type', function () {
		const type = this.get('type');

		return type ? `lightbox-${type}` : null;
	}),

	closeAllowed: Ember.computed.not('closeButtonHidden'),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			if (!this.get('closeAllowed')) {
				return;
			}

			this.setProperties({
				footer: null,
				header: null,
				footerExpanded: false
			});

			this.sendAction('closeLightbox');
		},

		/**
		 * @param {string} footer
		 * @returns {void}
		 */
		setFooter(footer) {
			this.set('footer', footer);
		},

		/**
		 * @param {string} header
		 * @returns {void}
		 */
		setHeader(header) {
			this.set('header', header);
		},

		/**
		 * @param {boolean} hidden
		 * @returns {void}
		 */
		setCloseButtonHidden(hidden) {
			this.set('closeButtonHidden', hidden);
		},

		/**
		 * @param {string} name
		 * @param {*} value
		 * @returns {void}
		 */
		setQueryParam(name, value) {
			this.sendAction('setQueryParam', name, value);
		},

		/**
		 * @returns {void}
		 */
		toggleFooter() {
			this.toggleProperty('footerExpanded');
		},

		/**
		 * @returns {void}
		 */
		toggleUI() {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		},
	},

	/**
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event) {
		const $target = this.$(event.target);

		if ($target.is('.lightbox-footer')) {
			this.send('toggleFooter');
		} else if ($target.is('.lightbox-close-wrapper')) {
			this.send('close');
		} else {
			this.send('toggleUI');
		}
	},

	/**
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	keyDown(event) {
		if (this.get('closeAllowed') && event.keyCode === 27) {
			this.send('close');
		}
	},
});
