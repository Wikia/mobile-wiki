/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditSectionRoute = Em.Route.extend({

	renderTemplate: function (): void {
		this.render('curated-content-edit-section');
	},


	serialize: function (model: CuratedContentEditItemInterface) {
		return {
			sectionLabel: encodeURI(encodeURIComponent(model.title))
		};
	},

	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any) {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEdit.index');
		}
	}
});
