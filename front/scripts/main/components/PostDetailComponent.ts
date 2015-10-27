/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

App.PostDetailComponent = Em.Component.extend(
	App.DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-detail'],

		postId: null,
		authorUrl: Em.computed('post', function (): string {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),

		// Whether the component is displayed on the post details discussion page
		isDetailsView: false,

		// Whether the share-feature component is visible inside this component
		isShareFeatureVisible: false,

		// Timeout used for auto-hiding the sharing icons
		hideShareTimeout: null,

		// URL passed to the ShareFeatureComponent for sharing a post
		sharedUrl: Em.computed('postId', function () {
			return Em.getWithDefault(Mercury, 'wiki.basePath', window.location.origin) + '/d/p/' + this.get('postId');
		}),

		actions: {
			/**
			 * @param {number} postId
			 * @returns {undefined}
			 */
			goToPost(postId: number): void {
				this.sendAction('goToPost', postId);
			},

			/**
			 * @returns {undefined}
			 */
			toggleShareComponent(): void {
				if (this.get('isShareFeatureVisible')) {
					this.set('isShareFeatureVisible', false);
				} else {
					this.set('isShareFeatureVisible', true);
					this.hideShareTimeout = Em.run.later(this, function () {
						this.set('isShareFeatureVisible', false);
					}, 5000);
				}
			},

			/**
			 * @returns {undefined}
			 */
			hideShareComponent(): void {
				this.set('isShareFeatureVisible', false);
			},

			/**
			 * @returns {undefined}
			 */
			cancelHideShareComponent(): void {
				Em.run.cancel(this.hideShareTimeout);
			},
		},

		/**
		 * @returns {undefined}
		 */
		willDestroyElement(): void {
			Em.run.cancel(this.hideShareTimeout);
		},
	}
);
