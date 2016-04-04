import DiscussionPostCardBaseComponent from './discussion-post-card-base';

export default DiscussionPostCardBaseComponent.extend({
	classNames: ['post-reply'],
	classNameBindings: ['isParentDeleted', 'isHighlighted'],

	isHighlighted: Ember.computed.equal('post.id', 'permalinkedReplyId'),
});
