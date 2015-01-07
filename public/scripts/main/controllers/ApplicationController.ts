/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	smartBannerVisible: false,
	sideNavCollapsed: true,

	init: function () {
		this.setProperties({
			domain: Em.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			language: Em.get(Mercury, 'wiki.language'),
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

		// This event is for tracking mobile sessions between Mercury and WikiaMobile
		M.track({
			action: M.trackActions.impression,
			category: 'app',
			label: 'load'
		});

		this._super();
	}
});
