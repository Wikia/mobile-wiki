/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	init: function () {
		this.setProperties({
			domain: Wikia.wiki.dbName || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			siteName: Wikia.wiki.siteName || 'Wikia',
			globalAnimSpeed: 100
		});

		this._super();
	}
});
