/// <reference path="../app.ts" />
/// <reference path="../mixins/FullPageMixin.ts"/>
'use strict';

App.DiscussionForumRoute = Em.Route.extend(App.FullPageMixin, {
	forumId: null,
	sortBy: null,

	model (params: any) {
		this.set('forumId', params.forumId);
		this.set('sortBy', params.sortBy);
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId, params.sortBy);
	},

	actions: {
		goToPost: function (postId: number): void {
			this.transitionTo('discussion.post', postId);
		},

		loadPage: function (pageNum: number): void {
			this.modelFor('discussion.forum').loadPage(pageNum);
		},

		setSortBy: function (sortBy: string): void {
			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		}
	}
});
