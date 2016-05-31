import Ember from 'ember';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';

export default Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNames: ['small-5', 'large-4', 'upvote'],
		classNameBindings: ['hasUpvoted'],

		hasUpvoted: Ember.computed.readOnly('post.userData.hasUpvoted'),
	}
);
