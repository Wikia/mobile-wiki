import { alias, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import RenderComponentMixin from '../mixins/render-component';
import scrollIntoView from '../utils/scroll-into-view';

export default Component.extend(RenderComponentMixin, {
	lightbox: service(),

	classNames: ['lightbox-wrapper', 'wds-font-size-xs', 'wds-leading-tight'],
	classNameBindings: ['isVisible:open', 'uiHidden:lightbox-ui-hidden'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,

	closeButtonHidden: false,
	footerExpanded: false,
	footer: null,
	footerHead: '',
	footerLink: null,
	header: null,
	uiHidden: false,
	thumbnails: null,

	isVisible: alias('lightbox.isVisible'),
	lightboxCloseButtonDelay: alias('lightbox.closeButtonDelay'),
	type: alias('lightbox.lightboxType'),
	model: alias('lightbox.model'),

	closeAllowed: not('closeButtonHidden'),

	lightboxComponent: computed('type', function () {
		const type = this.type;

		return type ? `lightbox-${type}` : null;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			if (!this.closeAllowed) {
				return;
			}

			this.setProperties({
				footer: null,
				footerHead: '',
				footerLink: null,
				header: null,
				footerExpanded: false,
				uiHidden: false,
				thumbnails: null,
				closeButtonHidden: false,
			});

			this.lightbox.close();
		},

		/**
		 * @param {string} footer
		 * @param {string} footerHead
		 * @returns {void}
		 */
		setFooter(footer, footerHead, footerLink) {
			this.set('footer', footer);
			this.set('footerHead', footerHead);
			this.set('footerLink', footerLink);
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
		 * @param {array} thumbnails: array of thumb urls
		 * @param {int} currentThumbnail: index of active thumbnail
		 */
		setThumbnails(thumbnails) {
			this.set('thumbnails', thumbnails);
		},

		setCurrentThumbnail(index) {
			this.element.querySelectorAll('.lightbox-thumbnail-active').forEach((item) => {
				item.classList.remove('lightbox-thumbnail-active');
			});

			const activeThumbnail = this.element.querySelector(`[data-ref="${index}"]`);
			if (activeThumbnail) {
				activeThumbnail.classList.add('lightbox-thumbnail-active');
			}
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
			this.toggleProperty('uiHidden');
		},
	},

	/**
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event) {
		const target = event.target;

		if (target.classList.contains('lightbox-footer-content')) {
			this.send('toggleFooter');
		} else if (target.classList.contains('lightbox-close-wrapper')) {
			this.send('close');
		} else if (target.classList.contains('lightbox-thumbnail') || target.closest('.lightbox-thumbnails-container')) {
			this.set('model.galleryRef', parseInt(target.getAttribute('data-ref'), 10));
			scrollIntoView(target, { block: 'end', inline: 'nearest', behavior: 'smooth' });
		} else {
			this.send('toggleUI');
		}
	},

	/**
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	keyDown(event) {
		if (this.closeAllowed && event.keyCode === 27) {
			this.send('close');
		}
	},
});
