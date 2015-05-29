/// <reference path="../app.ts" />
'use strict';

App.LightboxWrapperComponent = Em.Component.extend({
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,
	lightboxFooterExpanded: false,
	footerHidden: false,
	headerHidden: false,
	header: null,
	footer: null,

	type: null,
	model: null,

	status: Em.computed('type', function (): string {
		return (this.get('type')) ? 'open' : 'hidden';
	}),

	lightboxComponent: Em.computed('type', function (): string {
		var type: string = this.get('type');
		return type ?  'lightbox-' + type : null;
	}),

	click: function (event: MouseEvent) {
		var $target = this.$(event.target);

		if ($target.is('.lightbox-footer')) {
			this.send('toggleFooter');
		} else if ($target.is('.lightbox-close-wrapper')) {
			this.send('close');
		} else {
			this.send('toggleUI');
		}
	},

	keyDown: function (event: KeyboardEvent): void {
		if (event.keyCode === 27) {
			this.send('close');
		}
	},

	actions: {
		close: function (): void {
			this.sendAction('closeLightbox');
		},
		toggleFooter: function (): void {
			this.toggleProperty('lightboxFooterExpanded');
		},
		toggleUI: function (): void {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		}
	},

	didInsertElement: function (): void {
		this.setProperties({
			lightboxFooterExpanded: false,
			footerHidden: false,
			headerHidden: false
		});

		// This is needed for keyDown event to work
		this.$().focus();
	}
});
