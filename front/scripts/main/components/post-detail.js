import App from '../app';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';

export default App.PostDetailComponent = Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-detail'],
		classNameBindings: ['isDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		canDelete: Ember.computed('post.isDeleted', function () {
			return !this.get('post.isDeleted') && this.checkPermissions('canDelete');
		}),
		canUndelete: Ember.computed('post.isDeleted', function () {
			return this.get('post.isDeleted') && this.checkPermissions('canUndelete');
		}),
		postId: null,
		authorUrl: Ember.computed('post', function () {
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
		sharedUrl: Ember.computed('postId', function () {
			return `${Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)}/d/p/${this.get('postId')}`;
		}),

		/**
		 * Check if user has permissions to perform selected operation
		 * @returns {boolean}
		 */
		checkPermissions(permission) {
			const userData = this.get('post._embedded.userData'),
				permissions = userData && userData[0].permissions;

			return permissions && permissions.contains(permission);
		},

		actions: {
			/**
			 * @param {number} postId
			 * @returns {void}
			 */
			goToPost(postId) {
				this.sendAction('goToPost', postId);
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
