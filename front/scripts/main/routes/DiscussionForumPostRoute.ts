/// <reference path="../app.ts" />

App.DiscussionForumPostRoute = Em.Route.extend({
	model (params: any): Em.RSVP.Promise {
		return App.PostModel.find(Mercury.wiki.id, params.postId);
	},
	afterModel (model: typeof App.PostModel): void {
		var title: string = model.get('title');
		if (!title) {
			title = 'Discussion on ' + Mercury.wiki.siteName;
		}
		this.controllerFor('application').set('currentTitle', title);
	}
});
