/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditSectionRouteParamsInterface {
	section: string
}

App.CuratedContentEditorEditSectionRoute = Em.Route.extend({
	model: function(params: CuratedContentEditorEditSectionRouteParamsInterface): any {
		var section = decodeURIComponent(params.section),
			sectionModel = App.CuratedContentEditorModel.getBlockItem(this.modelFor('curatedContentEditor'), 'curated', section);

		return {
			// TODO: Do we still need to pass the block? If yes, can we move it out from the model?
			block: 'curated',
			item: sectionModel
		};
	},

	setupController: function(controller: any, model: typeof App.CuratedContentEditorItemModel) {
		this._super(controller, model);
		controller.set('model.originalSectionModel', $.extend({}, model.item));
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var originalSectionModel = this.modelFor('curatedContentEditor.editSection').originalSectionModel;

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(originalSectionModel.label));
		},

		updateItem: function (newSection: CuratedContentEditorItemInterface): void {
			var originalSectionModel = this.modelFor('curatedContentEditor.editSection').originalSectionModel;

			this.transitionTo('curatedContentEditor.section', {
				originalLabel: originalSectionModel.label,
				data: newSection
			});
		},

		deleteItem(): void {
			var originalSectionModel = this.modelFor('curatedContentEditor.editSection').originalSectionModelItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.deleteBlockItem(currentModel, 'curated', originalSectionModel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
