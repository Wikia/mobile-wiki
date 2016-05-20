import Ember from 'ember';
import DiscussionUpvoteComponentMixin from '../mixins/discussion-upvote-component';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';

export default Ember.Component.extend(
	DiscussionUpvoteComponentMixin,
	DiscussionUpvoteActionSendMixin, {
		tagName: 'li',
		classBindings: ['upvote-area'],

		click () {
			this.get('upvote')(this.get('post'));
		},
	}
);
