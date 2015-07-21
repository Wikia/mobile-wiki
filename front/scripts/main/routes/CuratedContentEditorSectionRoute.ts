/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	model: function (params: any) {
		var section = decodeURIComponent(params.section),
			currentModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getBlockItem(currentModel, 'regular', section);
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-section');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
