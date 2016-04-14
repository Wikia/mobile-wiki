import DiscussionPostCardBaseComponent from './discussion-post-card-base';

export default DiscussionPostCardBaseComponent.extend({
	classNames: ['post-reply'],
	classNameBindings: ['isParentDeleted', 'isHighlighted', 'scrollToMark'],

	isHighlighted: Ember.computed('post.id', 'permalinkedReplyId', function () {
		return this.get('post.id') === this.get('permalinkedReplyId');
	}),

	scrollToMark: Ember.computed.or('isHighlighted', 'post.scrollToMark'),
});
