/// <reference path="../app.ts" />

App.DiscussionPostRoute = Em.Route.extend({
	model (params: any): Em.RSVP.Promise {
		return App.DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	afterModel (model: typeof App.DiscussionPostModel): void {
		var title: string = model.get('title');
		if (!title) {
			title = i18n.t('discussion.share-default-title', {siteName: Mercury.wiki.siteName});
		}
		this.controllerFor('application').set('currentTitle', title);
	},

	activate (): void {
		// Enables vertical-colored theme bar in site-head component
		this.controllerFor('application').set('themeBar', true);
	},

	deactivate (): void {
		// Disables vertical-colored theme bar in site-head component
		this.controllerFor('application').set('themeBar', false);
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
