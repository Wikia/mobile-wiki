/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorAddSectionItemRoute = Em.Route.extend({
	model: function (params: any): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.create({
			section: decodeURIComponent(params.section)
		});
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var section = this.modelFor('curatedContentEditor.addSectionItem').section;
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(section));
		},

		updateItem: function (newItem: CuratedContentEditorItemInterface) {
			var section = this.modelFor('curatedContentEditor.addSectionItem').section,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				updatedModel: typeof App.CuratedContentEditorModel;

			updatedModel = App.CuratedContentEditorModel.addSectionItem(currentModel, newItem, section);
			currentModel.set('model', updatedModel);

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(section));
		}
	}
});
