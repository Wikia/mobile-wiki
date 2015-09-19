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
		},

		upvote(post: typeof App.DiscussionPostModel): void {
			var hasUpvoted: boolean,
				method: string,
				oldUpvoteCount: number = post.upvoteCount;

			if (typeof post._embedded.userData === 'undefined') {
				return null;
			}

			hasUpvoted = post._embedded.userData[0].hasUpvoted;
			method = (hasUpvoted ? 'delete' : 'post');

			// assuming the positive scenario, the change in the front-end is dome here
			Em.set(post, 'upvoteCount', oldUpvoteCount + (hasUpvoted ? -1 : 1));
			Em.set(post._embedded.userData[0], 'hasUpvoted', !hasUpvoted);

			Em.$.ajax({
				method: method,
				url: 'https://' + M.prop('servicesDomain') +
				'/discussion/' + post.siteId + '/votes/post/' + post.id,
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any) => {
					Em.set(post, 'upvoteCount', data.upvoteCount);
				},
				error: (err: any) => {
					// @TODO: handle errors

					Em.set(post, 'upvoteCount', oldUpvoteCount);
					Em.set(post._embedded.userData[0], 'hasUpvoted', !post._embedded.userData[0].hasUpvoted);
				}
			});
		}
	}
});
