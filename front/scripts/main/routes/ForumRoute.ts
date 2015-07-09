/// <reference path="../app.ts" />

App.ForumRoute = Em.Route.extend({
	model(params) {
		return App.ForumModel.find(Mercury.wiki.id, params.forumId);
	}
});
