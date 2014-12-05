/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	smartBannerVisible: false,
	sideNavCollapsed: true,

	init: function () {
		this.setProperties({
			domain: Em.getWithDefault(Mercury, 'wiki.dbName', window.location.href.match(/^https?:\/\/(.*?)\./)[1]),
			language: Em.get(Mercury, 'wiki.language'),
			mainPage: Em.get(Mercury, 'wiki.mainPage'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'),
			globalAnimSpeed: 100
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
