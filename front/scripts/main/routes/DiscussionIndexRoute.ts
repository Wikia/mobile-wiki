/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionLayoutMixin.ts" />

'use strict';

App.DiscussionIndexRoute = Em.Route.extend(App.DiscussionLayoutMixin, {
	/**
	 * @returns {void}
	 */
	beforeModel(): void {
		var controller = this.controllerFor('discussionForum');

		this.transitionTo('discussion.forum', Mercury.wiki.id, controller.get('sortTypes')[0].name);
	},

	/**
	 * @returns {*}
	 */
	model(): any {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
