/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
'use strict';

App.MainPageController = Em.Controller.extend({
	init: function (): void {
		this.set('siteName', Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia'));
	},

	actions: {
		openCuratedContentItem: function(item) {
			var categoryName;

			if (item.type === 'section') {
				this.transitionToRoute('mainPage.section', item.label);
			} else if (item.type === 'category') {
				console.log(item);
				categoryName = item.categoryName.substr(item.categoryName.indexOf(':') + 1);
				this.transitionToRoute('mainPage.category', categoryName);
			}
		}
	}
});
