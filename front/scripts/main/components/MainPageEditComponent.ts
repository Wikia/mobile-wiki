/// <reference path="../app.ts" />
'use strict';

App.MainPageEditComponent = Em.Component.extend({
	actions: {
		editItem: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('editItem', item);
		},

		openSection: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
