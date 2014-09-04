/// <reference path="../app.ts" />
'use strict';

App.LightboxController = Em.ObjectController.extend({
	header: null,
	contents: null,
	footer: null,
	lightboxFooterExpanded: null,
	footerHidden: null,
	headerHidden: null,

	actions: {
		toggleFooter: function(): void {
			this.toggleProperty('lightboxFooterExpanded');
		},
		hideUI: function(): void {
			this.toggleProperty('footerHidden');
			this.toggleProperty('headerHidden');
		}
	}
});
