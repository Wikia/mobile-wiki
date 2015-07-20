/// <reference path="../app.ts" />

App.ForumPostRoute = Em.Route.extend({
	model(params:any) {
		return App.PostModel.find(Mercury.wiki.id, params.postId);
	}
});
