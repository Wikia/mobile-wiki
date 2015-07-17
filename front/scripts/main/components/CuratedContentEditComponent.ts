/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditComponent = Em.Component.extend({
	classNames: ['curated-content-edit'],

	actions: {
		editItem: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('editItem', item);
		},

		editBlockItem: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('editBlockItem', item);
		},

		openSection: function (item: CuratedContentEditItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
