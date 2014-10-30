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

	hammerOptions: {
		touchAction: 'auto'
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
	},

	keyDown: function (event: KeyboardEvent): void {
		if (event.keyCode === 27) {
			this.get('controller').send('closeLightbox');
		}
	}
});
