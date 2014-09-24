/// <reference path="../app.ts" />
'use strict';

App.LightboxView = Em.View.extend({
	layoutName: 'app/lightbox',
	classNames: ['lightbox-wrapper'],
	classNameBindings: ['status'],
	attributeBindings: ['tabindex'],
	tabindex: 1,
	lightboxFooterExpanded: false,
	footerHidden: false,
	headerHidden: false,
	status: 'open',

	actions: {
		toggleFooter: function (): void {
			this.toggleProperty('lightboxFooterExpanded');
		},
		toggleUI: function (): void {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		}
	},

	//this is needed if view wants to handle keyboard
	didInsertElement: function (): void {
		this.$().focus();

		this.setProperties({
			lightboxFooterExpanded: false,
			footerHidden: false,
			headerHidden: false
		});
	},

	keyDown: function (event: KeyboardEvent): void {
		if (event.keyCode === 27) {
			this.get('controller').send('closeLightbox');
		}
	}
});
