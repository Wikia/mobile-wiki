/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	init: function () {
		this.setProperties({
			domain: Mercury.wiki.dbName || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			siteName: Mercury.wiki.siteName || 'Wikia',
			language: Mercury.wiki.language,
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
