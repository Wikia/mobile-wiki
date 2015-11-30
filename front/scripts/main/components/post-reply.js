import App from '../app';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default App.PostReplyComponent = Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	DiscussionParsedContentMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isDeleted', 'isParentDeleted'],
		post: null,

		authorUrl: Ember.computed('post', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),
	}
);
