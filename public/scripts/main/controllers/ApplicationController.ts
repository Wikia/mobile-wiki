/// <reference path="../app.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend({
	init: function () {
		this._super();
		this.set('domain', Wikia.wiki.dbName || window.location.href.match(/^https?:\/\/(.*?)\./)[1]);
		this.set('siteName', Wikia.wiki.siteName || 'Wikia');
		this.set('globalAnimSpeed', 100);
	}
});
