/// <reference path="../app.ts" />

App.DiscussionForumRoute = Em.Route.extend({
	model (params: any) {
		return App.DiscussionForumModel.find(Mercury.wiki.id, params.forumId);
	},

	actions: {
		goToPost: function (postId: number): void {
			this.transitionTo('discussion.post', postId);
		},
		willTransition: function(transition: EmberStates.Transition): boolean {
			transition.then(() => {
				this.controllerFor('application').set('fullPage', false);
			});
			return true;
		},
		didTransition: function(): boolean {
			this.controllerFor('application').set('fullPage', true);
			return true;
		},

		loadPage: function (pageNum: number): void {
			var model = this.modelFor('discussion.forum');

			model.loadPage(pageNum);
		}
	}
});
