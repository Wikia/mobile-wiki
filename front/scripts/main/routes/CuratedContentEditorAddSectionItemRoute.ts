/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorAddSectionItemRoute = Em.Route.extend({
	model: function (params: any): Em.RSVP.Promise {
		return App.CuratedContentEditorItemModel.getEmpty(params);
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			// We wouldn't get here without being in section route before. Model is already there so let's reuse it.
			this.transitionTo('curatedContentEditor.section', this.modelFor('curatedContentEditor.section'));
		}
	}
});
