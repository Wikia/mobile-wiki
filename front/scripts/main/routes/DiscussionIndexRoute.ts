/// <reference path="../app.ts" />

App.DiscussionIndexRoute = Em.Route.extend({
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
