/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

<<<<<<< HEAD
	getOtherItemLabels: function (): string[] {
		var items = this.modelFor('curatedContentEditor.section').items;

		return items.map((item: CuratedContentEditorItemInterface): string => { return item.label }).filter(String);
	},

	setupController: function (controller: any, model: typeof App.CuratedContentEditorItemModel): void {
		this._super(controller, model);
		controller.set('otherItemLabels', this.getOtherItemLabels());
	},

	renderTemplate: function (): void {
=======
	renderTemplate(): void {
>>>>>>> origin/CONCF-806
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		done(newItem: CuratedContentEditorItemModel): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			App.CuratedContentEditorModel.addItem(sectionModel, newItem);
			this.transitionTo('curatedContentEditor.section.index');
		},

		deleteItem(): void {
			this.send('goBack');
		}
	}
});
