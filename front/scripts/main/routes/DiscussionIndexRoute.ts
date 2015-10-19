/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
'use strict';

App.DiscussionIndexRoute = Em.Route.extend(App.UseNewNavMixin, {
	/**
	 * @returns {void}
	 */
	beforeModel(): void {
		var controller = this.controllerFor('discussionForum');

		this.transitionTo('discussion.forum', Mercury.wiki.id, controller.get('sortTypes')[0].name);
	},

	/**
	 * @returns {any}
	 */
	model(): any {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
