/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />
/// <reference path="../mixins/ThemeMixin.ts" />

'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.UseNewNavMixin, App.DiscussionRouteUpvoteMixin, App.ThemeMixin, {
	defaultSortType: null,
	forumId: null,

	model(params: any) {
		var sortBy: string;
		this.set('forumId', params.forumId);

		sortBy = params.sortBy || this.defaultSortType;
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, sortBy);
	},

	setupController(controller: Em.Controller, model: Em.Object, transition: EmberStates.Transition) {
		this._super(controller, model, transition);
		this.defaultSortType = controller.get('sortTypes')[0].name;
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || this.defaultSortType);
	},

	actions: {
		goToPost(postId: number): void {
			var postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));

			this.transitionTo('discussion.post', postId);
		},

		loadPage(pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		retry(): void {
			this.refresh();
		},

		goToAllDiscussions(): void {
			this.transitionTo('discussion.index');
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
