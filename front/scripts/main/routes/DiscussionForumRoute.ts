/// <reference path="../app.ts" />

App.DiscussionForumRoute = Em.Route.extend({
	model (params: any) {
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId);
	},

	actions: {
		goToPost: function (postId: number): void {
			this.transitionTo('discussion.post', postId);
		}
	}
});
