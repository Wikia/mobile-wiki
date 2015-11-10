import Ember from 'ember';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send.js';

const PostReplyComponent = Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-reply'],
		post: null,

		authorUrl: Ember.computed('post', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),
	}
);

export default PostReplyComponent;
