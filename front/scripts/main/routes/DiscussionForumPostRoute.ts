/// <reference path="../app.ts" />

App.DiscussionForumPostRoute = Em.Route.extend({
	model (params: any) {
		return App.PostModel.find(Mercury.wiki.id, params.postId);
	},

	activate (): void {
		// Enables vertical-colored theme bar in site-head component
		this.controllerFor('application').set('themeBar', true);
	},

	deactivate (): void {
		// Disables vertical-colored theme bar in site-head component
		this.controllerFor('application').set('themeBar', false);
	}
});
