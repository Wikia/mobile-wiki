/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.MainPageController = Em.Controller.extend({
	application: Em.inject.controller(),

	noAds: Em.computed.alias('application.noAds'),

	init(): void {
		this.setProperties({
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	}
});
