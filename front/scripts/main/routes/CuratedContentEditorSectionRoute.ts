/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	model(params: any): typeof App.CuratedContentEditorItemModel {
		var section: string = decodeURIComponent(params.section),
			rootModel: typeof App.CuratedContentEditorItemModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getItem(rootModel['curated'], section);
	},

	setupController(
		controller: any,
		model: typeof App.CuratedContentEditorItemModel,
		transition: EmberStates.Transition
	): void {
		this._super(controller, model, transition);
		controller.set('originalSectionLabel', model.label);
	},

	actions: {
		addItem(): void  {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		editItem(item: typeof App.CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		editSection(): void {
			this.transitionTo('curatedContentEditor.section.edit');
		},

		done(newSection: typeof App.CuratedContentEditorItemModel): void {
			var rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel');

			App.CuratedContentEditorModel.updateItem(rootModel['curated'], newSection, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
