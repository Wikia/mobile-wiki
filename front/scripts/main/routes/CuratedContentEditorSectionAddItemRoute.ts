/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend({
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
			alreadyUsedLabels = App.CuratedContentEditorModel.getAlreadyUsedNonFeaturedItemsLabels(rootModel);

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', alreadyUsedLabels);
	},

	renderTemplate(): void {
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
