import DiscussionPostCardBaseComponent from './discussion-post-card-base';

export default DiscussionPostCardBaseComponent.extend({
	classNames: ['post-reply'],
	classNameBindings: ['isParentDeleted', 'isHighlighted'],

	isHighlighted: Ember.computed('post.id', 'permalinkReplyId', function () {
		return this.get('post.id') === this.get('permalinkReplyId');
	}),
});
