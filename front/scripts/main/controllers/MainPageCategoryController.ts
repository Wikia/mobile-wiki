/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.MainPageCategoryController = Em.Controller.extend({
	init: function (): void {
		this.set('siteName', Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'));
		this.set('mainPageTitle', Em.get(Mercury, 'wiki.mainPageTitle'));
		this.set('title', 'a');
	}
});
