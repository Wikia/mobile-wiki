/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.MainPageController = Em.Controller.extend({
	needs: ['application'],

	noAds: Em.computed.alias('controllers.application.noAds'),

	init: function (): void {
		this.set('siteName', Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'));
	}
});
