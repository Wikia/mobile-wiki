/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddItemRoute = Em.Route.extend(
	App.TrackClickMixin,
	{
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew();
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var parentSection = this.modelFor('curatedContentEditor.section');

		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(parentSection));
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
			this.trackClick('curated-content-editor', 'item-delete');
			this.send('goBack');
		}
	}
});
