/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorSectionItemRouteParamsInterface {
	section: string;
	item: CuratedContentEditorItemInterface
}

App.CuratedContentEditorSectionItemRoute = Em.Route.extend({
	serialize: function (model: CuratedContentEditorSectionItemRouteParamsInterface) {
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
	beforeModel: function (transition: any) {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	}
});
