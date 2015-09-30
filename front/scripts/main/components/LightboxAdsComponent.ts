/// <reference path="../app.ts" />
'use strict';

App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	didInsertElement(): void {
		this.sendAction('setHeader', 'Advertisement');
	}
});
