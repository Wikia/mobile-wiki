import Ember from 'ember';
import DiscussionUpvoteComponentMixin from '../mixins/discussion-upvote-component.js';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send.js';

const DiscussionUpvotePostComponent = Ember.Component.extend(
	DiscussionUpvoteComponentMixin,
	DiscussionUpvoteActionSendMixin
);

export default DiscussionUpvotePostComponent;
