/// <reference path="../app.ts" />

App.DiscussionForumRoute = Em.Route.extend({
	model (params: any) {
		return App.ForumModel.find(Mercury.wiki.id, params.forumId);
	}
});
