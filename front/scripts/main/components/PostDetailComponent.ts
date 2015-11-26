/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionUpvoteActionSendMixin.ts" />
'use strict';

interface Window {
	Autolinker: any;
}

App.PostDetailComponent = Em.Component.extend(
	App.DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-detail'],

		/**
		 * Returns post content with links created from urls
		 * @returns {string}
		 */
		parsedContent: Em.computed(function () {
			var escapedContent = Ember.Handlebars.Utils.escapeExpression(
				this.get('post.rawContent')
			);

			return window.Autolinker.link(escapedContent, {
				stripPrefix: false,
				email: false,
				phone: false,
				twitter: false
			});
		}),

		postId: null,

		/**
		 * Returns link to the post author's user page
		 * returns {string}
		 */
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
			 * @returns {void}
			 */
			goToPost(postId: number): void {
				this.sendAction('goToPost', postId);
			},

			/**
			 * @returns {void}
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
			 * @returns {void}
			 */
			hideShareComponent(): void {
				this.set('isShareFeatureVisible', false);
			},

			/**
			 * @returns {void}
			 */
			cancelHideShareComponent(): void {
				Em.run.cancel(this.hideShareTimeout);
			},
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement(): void {
			Em.run.cancel(this.hideShareTimeout);
		},
	}
);
