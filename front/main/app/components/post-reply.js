import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted', 'isReported'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		isModerationTools: Ember.computed('post.isReported', 'post.isDeleted', function () {
			return this.get('post.isReported') && !this.get('post.isDeleted');
		}),
		isReported: Ember.computed.alias('post.isReported'),
	}
);
