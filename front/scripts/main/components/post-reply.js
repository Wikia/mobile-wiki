import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	DiscussionParsedContentMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		post: null
	}
);
