import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	DiscussionParsedContentMixin,
	{
		classNames: ['post-detail'],
		classNameBindings: ['isNew', 'isDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		postId: null,

		routing: Ember.inject.service('-routing'),

		// Whether the component is displayed on the post details discussion page
		isDetailsView: false,

		// Whether the share-feature component is visible inside this component
		isShareFeatureVisible: false,

		// Timeout used for auto-hiding the sharing icons
		hideShareTimeout: null,

		isNew: Ember.computed.oneWay('post.isNew'),

		// URL passed to the ShareFeatureComponent for sharing a post
		sharedUrl: Ember.computed('postId', function () {
			const localPostUrl = this.get('routing').router.generate('discussion.post', this.get('postId'));

			return `${Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)}${localPostUrl}`;
		}),

		actions: {
			/**
			 * @param {number} postId
			 * @param {MouseEvent} event
			 * @returns {void}
			 */
			goToPost(postId, event) {
				event.preventDefault();
				if (event.ctrlKey || event.metaKey) {
					this.sendAction('goToPost', postId, true);
				} else {
					this.sendAction('goToPost', postId);
				}
			},

			/**
			 * @returns {void}
			 */
			toggleShareComponent() {
				if (this.get('isShareFeatureVisible')) {
					this.set('isShareFeatureVisible', false);
				} else {
					this.set('isShareFeatureVisible', true);
					this.hideShareTimeout = Ember.run.later(this, function () {
						this.set('isShareFeatureVisible', false);
					}, 5000);
				}
			},

			/**
			 * @returns {void}
			 */
			hideShareComponent() {
				this.set('isShareFeatureVisible', false);
			},

			/**
			 * @returns {void}
			 */
			cancelHideShareComponent() {
				Ember.run.cancel(this.hideShareTimeout);
			},
		},

		/**
		 * @returns {void}
		 */
		willDestroyElement() {
			Ember.run.cancel(this.hideShareTimeout);
		},
	}
);
