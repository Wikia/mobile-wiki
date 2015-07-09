/// <reference path="../app.ts" />

App.ForumThreadRoute = Em.Route.extend({
	model(params) {
		return App.ThreadModel.find(Mercury.wiki.id, params.threadId);
	}
});
