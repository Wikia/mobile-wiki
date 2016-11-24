import Ember from 'ember';
import DiscussionPostCardBaseComponent from './discussion-post-card-base';
import DiscussionCategoriesVisibilityMixin from '../mixins/discussion-categories-visibility';
import ResponsiveMixin from '../mixins/responsive';

const {computed} = Ember;

export default DiscussionPostCardBaseComponent.extend(
	DiscussionCategoriesVisibilityMixin,
	ResponsiveMixin,
	{
		classNames: ['post-detail'],

		currentUser: Ember.inject.service(),

		postId: Ember.computed.oneWay('post.threadId'),

		routing: Ember.inject.service('-routing'),

		// Whether the component is displayed on the post details discussion page
		isDetailsView: false,

		cropImages: computed('isDetailsView', 'responsive.isMobile', function () {
			return !this.get('isDetailsView') && this.get('responsive.isMobile');
		}),

		imagesWidthMultiplier: computed('isDetailsView', 'responsive.isMobile', function () {
			return this.get('isDetailsView') && !this.get('responsive.isMobile') ? 3 : 1;
		}),

		showOpenGraphCard: computed('post.contentImages', 'post.openGraph', function () {
			return Ember.isEmpty(this.get('post.contentImages')) && Boolean(this.get('post.openGraph'));
		}),

		showLastEditedByMessage: computed(
			'post.lastEditedBy', 'post.lastEditedBy.id', 'post.createdBy.id', function () {
				return this.get('showLastEditedBy') && Boolean(this.get('post.lastEditedBy'))
					&& this.get('post.createdBy.id') !== this.get('post.lastEditedBy.id');
			}),

		lastEditedByMessage: computed('post.lastEditedBy.name', function () {
			const userName = this.getWithDefault('post.lastEditedBy.name', '');

			return this.get('post.userData.permissions.canModerate')
				? i18n.t('main.last-edited-by', {userName, ns: 'discussion'})
				: i18n.t('main.last-edited-by-administrators', {ns: 'discussion'});
		}),

		// URL passed to the ShareFeatureComponent for sharing a post
		sharedUrl: computed('postId', function () {
			const localPostUrl = this.get('routing').router.generate('discussion.post', this.get('postId'));

			return `${Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)}${localPostUrl}`;
		}),

		categoryName: computed('categories.@each', 'post.categoryId', function () {
			const category = this.get('categories').findBy('id', this.get('post.categoryId'));

			return category ? category.get('name') : null;
		})
	}
);
