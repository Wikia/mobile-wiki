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

	showShareComponent: ($shareFeature: JQuery) => {
		$shareFeature.show();
		this.hideShareTimeout = window.setTimeout(() => {
			$shareFeature.hide();
		}, 5000);
	},

	didInsertElement: function () {
		if (!this.get('isDetailsView')) {
			var $shareFeature = this.$('.share-feature');

			this.$('.toggle-share')
				.on('mouseenter', () => { this.showShareComponent($shareFeature); })
				.on('click', () => { this.showShareComponent($shareFeature); });

			$shareFeature
				.on('mouseenter', () => {
					window.clearTimeout(this.hideShareTimeout);
				})
				.on('mouseleave', () => {
					$shareFeature.hide();
				});
		}

		this._super();
	},

	willDestroyElement: function () {
		if (!this.get('isDetailsView')) {
			this.$('.toggle-share, .share-feature').off();
		}

		this._super();
	},

	actions: {
		goToPost(postId: number): void {
			this.sendAction('goToPost', postId);
		}
	}
});
