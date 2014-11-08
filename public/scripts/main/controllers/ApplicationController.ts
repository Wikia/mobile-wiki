/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	init: function () {
		this.setProperties({
			domain: Mercury.wiki.dbName || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			siteName: Mercury.wiki.siteName || 'Wikia',
			language: Mercury.wiki.language,
			globalAnimSpeed: 100,
		});

		this._super();
	}
});
