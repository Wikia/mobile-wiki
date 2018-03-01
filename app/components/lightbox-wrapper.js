import {alias, not} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import {inject as service} from '@ember/service';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	lightbox: service(),

	classNames: ['lightbox-wrapper'],
	classNameBindings: ['isVisible:open'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,

	footerExpanded: false,
	footerHidden: false,
	headerHidden: false,
	header: null,
	footer: null,
	closeButtonHidden: false,

	isVisible: alias('lightbox.lightboxVisible'),
	lightboxCloseButtonDelay: alias('lightbox.lightboxCloseButtonDelay'),
	type: alias('lightbox.lightboxType'),
	model: alias('lightbox.lightboxModel'),

	closeAllowed: not('closeButtonHidden'),

	lightboxComponent: computed('type', function () {
		const type = this.get('type');

		return type ? `lightbox-${type}` : null;
	}),

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

			// this.get('closeLightbox')();
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
		const target = event.target;

		if (target.classList.contains('lightbox-footer')) {
			this.send('toggleFooter');
		} else if (target.classList.contains('lightbox-close-wrapper')) {
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
