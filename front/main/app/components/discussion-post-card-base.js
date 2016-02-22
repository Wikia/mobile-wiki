import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

/**
 * Basic methods/properties for post-detail and post-reply.
 */
export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNameBindings: ['isNew', 'isDeleted', 'isReported'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		isNew: Ember.computed.oneWay('post.isNew'),
		isReported: Ember.computed.alias('post.isReported'),
		showModerationTools: Ember.computed('isReported', 'isDeleted', function () {
			return this.get('isReported') && !this.get('isDeleted');
		})
	}
);

