/// <reference path="../app.ts" />
'use strict';

App.CuratedContentComponent = Em.Component.extend({
	classNames: ['curated-content'],
	model: null,
	section: null,
	showItems: false,
	classNameBindings: ['showItems'],
	cropMode: Mercury.Modules.Thumbnailer.mode.topCrop,

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentModel.create());
	},

	actions: {
		showItems: function (sectionName: string): void {
			this.toggleProperty('showItems');
			this.model.fetchItemsForSection(sectionName);
		},

		showGrid: function(): void {
			this.toggleProperty('showItems');
		}
	}
});
