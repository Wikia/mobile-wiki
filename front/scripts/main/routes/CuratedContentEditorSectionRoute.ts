/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	model(params: any): any {
		var section = decodeURIComponent(params.section),
			currentModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getBlockItem(currentModel, 'curated', section);
	},

	setupController(controller: any, model: typeof App.CuratedContentEditorItemModel): void {
		this._super(controller, model);
		controller.set('originalSectionLabel', model.label);
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		addItem: function (): void  {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		editItem: function (item: CuratedContentEditorItemInterface): void {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		editSection: function (): void {
			this.transitionTo('curatedContentEditor.section.edit');
		},

		updateSection(newSection: CuratedContentEditorItemInterface): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				originalSectionLabel = this.controllerFor('curatedContentEditor.section').get('originalSectionLabel');

			App.CuratedContentEditorModel.updateSection(currentModel, newSection, originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
