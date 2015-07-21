/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorEditSectionRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	serialize: function (model: CuratedContentEditorEditSectionItemRouteParamsInterface) {
		return {
			section: encodeURIComponent(model.item.title)
		};
	},

	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any) {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	actions: {
		goBack: function (): void {
			// We wouldn't get here without being in section route before. Model is already there so let's reuse it.
			// Going back cancels all changes made.
			this.transitionTo('curatedContentEditor.section', this.modelFor('curatedContentEditor.section'));
		}
	}
});
