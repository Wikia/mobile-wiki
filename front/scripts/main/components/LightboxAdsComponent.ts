/// <reference path="../app.ts" />
'use strict';

App.LightboxAdsComponent = Em.Component.extend({
	classNames: ['lightbox-ads', 'lightbox-content-inner'],

	/**
	 * @returns {undefined}
	 */
	didInsertElement(): void {
		this.sendAction('setHeader', 'Advertisement');
	}
});
