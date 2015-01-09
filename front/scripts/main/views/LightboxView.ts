/// <reference path="../app.ts" />
'use strict';

App.LightboxView = Em.View.extend({
	layoutName: 'lightbox',
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status'],
	attributeBindings: ['tabindex'],
	tabindex: 1,
	lightboxFooterExpanded: false,
	footerHidden: false,
	headerHidden: false,
	status: 'open',


	click: function (event: MouseEvent) {
		var $target = this.$(event.target);

		if ($target.is('.lightbox-footer')) {
			this.send('toggleFooter');
		} else if ($target.is('.lightbox-close-wrapper')) {
			this.get('controller').send('closeLightbox');
		} else {
			this.send('toggleUI');
		}
	},

	keyDown: function (event: KeyboardEvent): void {
		if (event.keyCode === 27) {
			this.get('controller').send('closeLightbox');
		}
	},

	actions: {
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

		//this is needed if view wants to handle keyboard
		this.$().focus();
	}
});
