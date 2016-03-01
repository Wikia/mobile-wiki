import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

const {Component, computed} = Ember;

/**
 * Basic methods/properties for discussion-post-card-detail and discussion-post-card-reply.
 */
export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNameBindings: ['isNew', 'isDeleted', 'isReported', 'showTopNote'],

		isDeleted: Ember.computed.alias('post.isDeleted'),
		isNew: Ember.computed.oneWay('post.isNew'),
		isReported: Ember.computed.alias('post.isReported'),
		showTopNote: Ember.computed('isDeleted', 'isReported', function () {
			return !this.get('isDeleted') && this.get('isReported') || this.get('showRepliedTo');
		})
	}
);
