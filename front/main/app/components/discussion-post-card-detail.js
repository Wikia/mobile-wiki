import Ember from 'ember';
import DiscussionPostCardBaseComponent from '../mixins/discussion-post-card-base';

export default Ember.Component.extend(DiscussionPostCardBaseComponent, {
	classNames: ['post-detail'],

	postId: Ember.computed.oneWay('post.threadId'),

	routing: Ember.inject.service('-routing'),

	// Whether the component is displayed on the post details discussion page
	isDetailsView: false,

	// URL passed to the ShareFeatureComponent for sharing a post
	sharedUrl: Ember.computed('postId', function () {
		const localPostUrl = this.get('routing').router.generate('discussion.post', this.get('postId'));

		return `${Ember.getWithDefault(Mercury, 'wiki.basePath', window.location.origin)}${localPostUrl}`;
	}),
});
