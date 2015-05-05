/// <reference path="../app.ts" />
'use strict';

App.CuratedContentComponent = Em.Component.extend({
	classNames: ['curated-content'],
	model: null,
	showItems: Em.computed.oneWay('model.showItems'),
	classNameBindings: ['showItems'],

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentModel.create());
	},

	actions: {
		showItems: function (sectionName: string): void {
			this.get('model').fetchItemsForSection(sectionName);
		},

		showGrid: function(): void {
			this.get('model').hideItems();
		}
	}
});
