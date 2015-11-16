import App from '../app';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import {buildUrl} from '../../baseline/mercury/utils/buildUrl';

App.PostReplyComponent = Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-reply'],
		post: null,

		authorUrl: Ember.computed('post', function () {
			return buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),
	}
);

export default App.PostReplyComponent;
