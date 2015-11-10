import Ember from 'ember';
import DiscussionUpvoteComponentMixin from '../mixins/discussion-upvote-component.js';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send.js';

const DiscussionUpvoteReplyComponent = Ember.Component.extend(
	DiscussionUpvoteComponentMixin,
	DiscussionUpvoteActionSendMixin
);

export default DiscussionUpvoteReplyComponent;
