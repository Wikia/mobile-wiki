import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

const {Mixin, computed} = Ember;

/**
 * Basic methods/properties for discussion-post-card-detail and discussion-post-card-reply.
 */
export default Mixin.create(
	DiscussionParsedContentMixin,
	{
		classNameBindings: ['isNew', 'isDeleted', 'isReported', 'isLocked', 'showTopNote'],

		isDeleted: computed.alias('post.isDeleted'),
		isLocked: computed.oneWay('post.isLocked'),
		isNew: computed.oneWay('post.isNew'),
		isReported: computed.alias('post.isReported'),
		showTopNote: computed('isDeleted', 'isReported', 'post.isLocked', function () {
			return !this.get('isDeleted') && this.get('isReported') || this.get('showRepliedTo') ||
				this.get('post.isLocked');
		})
	}
);
