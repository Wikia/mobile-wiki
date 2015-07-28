/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	getOtherItemLabels: function (): string[] {
		var items = this.modelFor('curatedContentEditor.section').items;

		return items.map((item: CuratedContentEditorItemInterface): string => { return item.label }).filter(String);
	},

	setupController: function (controller: any, model: typeof App.CuratedContentEditorItemModel): void {
		this._super(controller, model);
		controller.set('otherItemLabels', this.getOtherItemLabels());
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		updateItem: function (newItem: CuratedContentEditorItemInterface) {
			var sectionModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addSectionItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
