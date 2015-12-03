import App from '../app';
import DiscussionUpvoteActionSendMixin from '../mixins/discussion-upvote-action-send';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import {checkPermissions} from '../../mercury/utils/discussionPostPermissions';

export default App.PostReplyComponent = Ember.Component.extend(
	DiscussionUpvoteActionSendMixin,
	DiscussionParsedContentMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		canDelete: Ember.computed('post.isDeleted', function () {
			return !this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canDelete');
		}),
		canUndelete: Ember.computed('post.isDeleted', function () {
			return this.get('post.isDeleted') && checkPermissions(this.get('post'), 'canUndelete');
		}),
		post: null,

		authorUrl: Ember.computed('post', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),
	}
);
