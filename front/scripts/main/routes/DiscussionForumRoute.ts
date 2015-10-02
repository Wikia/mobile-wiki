/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />
'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.UseNewNavMixin, App.DiscussionRouteUpvoteMixin, {
	forumId: null,

	model(params: any) {
		this.set('forumId', params.forumId);
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, params.sortBy);
	},

	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition) {
		this._super(controller, model, transition);
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || controller.get('sortTypes')[0].name);
	},

	actions: {
		goToPost(postId: number): void {
			this.transitionTo('discussion.post', postId);
		},

		loadPage(pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		setSortBy(sortBy: string): void {
			var controller = this.controllerFor('discussionForum');

			controller.set('sortBy', sortBy);

			if (controller.get('sortAlwaysVisible') !== true) {
				this.controllerFor('discussionForum').set('sortVisible', false);
			}

			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		},
		didTransition(): boolean {
			this.controllerFor('application').set('noMargins', true);
			return true;
		}
	}
});
