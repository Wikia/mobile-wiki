import Ember from 'ember';

const DiscussionUpvoteReplyComponent = Ember.Component.extend(
	DiscussionUpvoteComponentMixin,
	DiscussionUpvoteActionSendMixin
);

export default DiscussionUpvoteReplyComponent;
