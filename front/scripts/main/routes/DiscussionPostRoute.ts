/// <reference path="../app.ts" />

App.DiscussionPostRoute = Em.Route.extend({
	model (params: any) {
		return App.DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	activate (): void {
		this.controllerFor('application').setProperties({
			// Enables vertical-colored theme bar in site-head component
			themeBar: true,
			enableSharingHeader: true
		});
	},

	deactivate (): void {
		this.controllerFor('application').setProperties({
			// Disables vertical-colored theme bar in site-head component
			themeBar: false,
			enableSharingHeader: false
		});
	},

	showMore: Em.computed('model', function (): boolean {
			var model = this.modelFor('discussion.post'),
				loadedRepliesLength = Em.get(model, 'replies.length');

			return loadedRepliesLength < model.postCount;
	}),

	actions: {
		expand: function () {
			var model = this.modelFor('discussion.post');

			model.loadNextPage();
		},

		didTransition(): boolean {
			window.scrollTo(0, 0);
			return true;
		}
	}
});
