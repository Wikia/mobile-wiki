/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
///<reference path="../components/CuratedContentEditorBlockComponent.ts"/>

'use strict';

App.CuratedContentEditorSectionItemRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	serialize: function (model: CuratedContentEditorBlockItemInterface) {
		return {
			// Sections have titles, section items have labels and titles - we want to show labels for them
			section: encodeURIComponent(model.section),
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

	model: function (params: any) {
		return App.CuratedContentEditorItemModel().getItem(params);
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
	}
});
