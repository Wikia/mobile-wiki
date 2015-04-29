/// <reference path="../app.ts" />
'use strict';

App.CuratedContentSectionComponent = Em.Component.extend({
	classNames: ['curated-content-section'],
	model: null,
	section: null,
	isExpanded: false,
	classNameBindings: ['isExpanded'],

	didInsertElement: function(): void {
		this.set('model', App.CuratedContentSectionModel.create());
	},

	actions: {
		expand: function (sectionName: string): void {
			this.toggleProperty('isExpanded');
			this.model.fetchItemsForSection(sectionName);
		},
	}
});
