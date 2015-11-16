/// <reference path="../app.ts" />
'use strict';

App.LightboxWrapperComponent = Em.Component.extend({
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

	lightboxComponent: Em.computed('type', function (): string {
		var type: string = this.get('type');
		return type ?  'lightbox-' + type : null;
	}),

	closeAllowed: Em.computed('closeButtonHidden', function (): boolean {
		return this.get('closeButtonHidden') ? false : true;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		close(): void {
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
		setFooter(footer: string): void {
			this.set('footer', footer);
		},

		/**
		 * @param {string} header
		 * @returns {void}
		 */
		setHeader(header: string): void {
			this.set('header', header);
		},

		/**
		 * @param {boolean} hidden
		 * @returns {void}
		 */
		setCloseButtonHidden(hidden: boolean): void {
			this.set('closeButtonHidden', hidden);
		},

		/**
		 * @param {string} name
		 * @param {*} value
		 * @returns {void}
		 */
		setQueryParam(name: string, value: any): void {
			this.sendAction('setQueryParam', name, value);
		},

		/**
		 * @returns {void}
		 */
		toggleFooter(): void {
			this.toggleProperty('footerExpanded');
		},

		/**
		 * @returns {void}
		 */
		toggleUI(): void {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		},
	},

	/**
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event: MouseEvent): void {
		var $target = this.$(event.target);

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
	keyDown(event: KeyboardEvent): void {
		if (this.get('closeAllowed') && event.keyCode === 27) {
			this.send('close');
		}
	},
});
