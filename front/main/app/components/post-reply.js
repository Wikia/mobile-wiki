import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted', 'isReported'],

		areModerationTools: Ember.computed('isReported', 'isDeleted', function () {
			return this.get('isReported') && !this.get('isDeleted');
		}),

		isDeleted: Ember.computed.alias('post.isDeleted'),
		isReported: Ember.computed.alias('post.isReported'),
	}
);
