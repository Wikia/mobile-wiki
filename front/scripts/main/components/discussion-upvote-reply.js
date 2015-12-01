import App from '../app';
import DiscussionUpvoteComponentMixin from '../mixins/discussion-upvote-component';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';

export default App.DiscussionUpvoteReplyComponent = Ember.Component.extend(
	DiscussionUpvoteComponentMixin,
	DiscussionUpvoteActionSendMixin
);
