/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.MainPageController = Em.Controller.extend({
	init: function (): void {
		this.set('siteName', Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'));
	}
});
