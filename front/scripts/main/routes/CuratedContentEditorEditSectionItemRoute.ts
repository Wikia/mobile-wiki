/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditSectionItemRouteParamsInterface {
	section: string;
	item: CuratedContentEditorItemInterface
}

App.CuratedContentEditorEditSectionItemRoute = Em.Route.extend({
	serialize: function (model: CuratedContentEditorEditSectionItemRouteParamsInterface): any {
		return {
			section: encodeURIComponent(model.section),
			// Sections have titles, section items have labels and titles - we want to show labels for them
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any): void {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			// We wouldn't get here without being in section route before. Model is already there so let's reuse it.
			// Going back cancels all changes made.
			this.transitionTo('curatedContentEditor.section', this.modelFor('curatedContentEditor.section'));
		}
	}
});
