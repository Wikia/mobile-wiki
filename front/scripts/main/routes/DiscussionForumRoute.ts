/// <reference path="../app.ts" />

App.DiscussionForumRoute = Em.Route.extend({
	model (params: any) {
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId);
	}
});
