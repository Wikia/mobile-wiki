/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditBlockItemRoute = Em.Route.extend({
	renderTemplate: function (): void {
		this.render('curated-content-edit-item');
	},

	serialize: function (model: CuratedContentEditBlockItemInterface) {
		return {
			block: model.block,
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

	model: function (params: any) {
		return App.CuratedContentEditItemModel().getItem(params);
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
