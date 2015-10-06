/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend(App.DiscussionUpvoteActionSendMixin, {
	classNames: ['post-detail'],

	postId: null,
	authorUrl: Em.computed('post', function (): string {
		return M.buildUrl({
			namespace: 'User',
			title: this.get('post.createdBy.name')
		});
	}),

	// Whether the component is displayed on the post details discussion page
	isDetailsView: false,

	// Timeout used for auto-hiding the sharing icons
	hideShareTimeout: null,

	// URL passed to the ShareFeatureComponent for sharing a post
	sharedUrl: Em.computed('postId', function () {
		return Em.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)
			+ '/d/p/' + this.get('postId');
	}),

	willDestroyElement(): void {
		if (!this.get('isDetailsView')) {
			this.$('.toggle-share').off();
		}

		this._super();
	},

	actions: {
		goToPost(postId: number): void {
			this.sendAction('goToPost', postId);
		},

		toggleShareComponent(): void {
			var $shareFeature = this.$('.share-feature');

			if ($shareFeature.is(':visible')) {
				$shareFeature.hide();
			} else {
				$shareFeature.show();
				this.hideShareTimeout = Em.run.later(this, function () {
					$shareFeature.hide();
				}, 5000);
			}
		},

		hideShareComponent(): void {
			this.$('.share-feature').hide();
		},

		cancelHideShareComponent(): void {
			Em.run.cancel(this.hideShareTimeout);
		}
	}
});
