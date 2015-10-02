/// <reference path="../app.ts" />
'use strict';

App.LightboxWrapperComponent = Em.Component.extend({
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['isVisible:open'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,

	isVisible: false,
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

	keyDown(event: KeyboardEvent): void {
		if (event.keyCode === 27) {
			this.send('close');
		}
	},

	actions: {
		close(): void {
			this.setProperties({
				footer: null,
				header: null,
				footerExpanded: false
			});
			this.sendAction('closeLightbox');
		},
		setFooter(footer: string): void {
			this.set('footer', footer);
		},
		setHeader(header: string): void {
			this.set('header', header);
		},
		setQueryParam(name: string, value: any): void {
			this.sendAction('setQueryParam', name, value);
		},
		toggleFooter(): void {
			this.toggleProperty('footerExpanded');
		},
		toggleUI(): void {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		}
	},

	didInsertElement(): void {
		// This is needed for keyDown event to work
		this.$().focus();
	}
});
