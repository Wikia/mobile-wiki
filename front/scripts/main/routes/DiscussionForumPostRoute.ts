/// <reference path="../app.ts" />

App.DiscussionForumPostRoute = Em.Route.extend({
	model(params:any) {
		return App.PostModel.find(Mercury.wiki.id, params.postId);
	}
});
