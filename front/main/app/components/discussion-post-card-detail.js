import Ember from 'ember';
import DiscussionPostCardBaseComponent from './discussion-post-card-base';
import DiscussionCategoriesVisibilityMixin from '../mixins/discussion-categories-visibility';

export default DiscussionPostCardBaseComponent.extend(
	DiscussionCategoriesVisibilityMixin,
	{
		classNames: ['post-detail'],

		currentUser: Ember.inject.service(),

		postId: Ember.computed.oneWay('post.threadId'),

		routing: Ember.inject.service('-routing'),

		shareDialogVisible: false,

		// Whether the component is displayed on the post details discussion page
		isDetailsView: false,

		// URL passed to the ShareFeatureComponent for sharing a post
		sharedUrl: Ember.computed('postId', function () {
			const localPostUrl = this.get('routing').router.generate('discussion.post', this.get('postId'));

			return `${Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)}${localPostUrl}`;
		}),

		categoryName: Ember.computed('categories.@each', 'post.categoryId', function () {
			const category = this.get('categories').findBy('id', this.get('post.categoryId'));

			return category ? category.get('name') : null;
		}),

		actions: {
			hideShareTooltip() {
				this.set('shareTooltipSeen', true);
			},

			showShareDialog() {
				this.set('shareDialogVisible', true);
			}
		}
	}
);
