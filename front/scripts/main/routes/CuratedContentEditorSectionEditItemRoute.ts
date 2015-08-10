/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditItemRoute = Em.Route.extend(
	App.TrackClickMixin,
	{
	model(params: any): CuratedContentEditorItemModel {
		var item: string = decodeURIComponent(params.item),
			sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

		return App.CuratedContentEditorModel.getItem(sectionModel, item);
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var parentSection = this.modelFor('curatedContentEditor.section');

		this._super(controller, model, transition);
		controller.setProperties({
			originalItemLabel: model.label,
			alreadyUsedLabels: App.CuratedContentEditorModel.getAlreadyUsedLabels(parentSection, model.label)
		});
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.section.index');
		},

		done(newItem: CuratedContentEditorItemModel): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section'),
				controller: any = this.controllerFor('curatedContentEditor.section.editItem'),
				originalItemLabel: string = controller.get('originalItemLabel');

			App.CuratedContentEditorModel.updateItem(sectionModel, newItem, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		},

		deleteItem(): void {
			this.trackClick('curated-content-editor', 'item-delete');
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section'),
				controller: any = this.controllerFor('curatedContentEditor.section.editItem'),
				originalItemLabel: string = controller.get('originalItemLabel');

			App.CuratedContentEditorModel.deleteItem(sectionModel, originalItemLabel);
			this.transitionTo('curatedContentEditor.section.index');
		}
	}
});
