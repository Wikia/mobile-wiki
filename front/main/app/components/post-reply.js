import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),

		linkTitle: Ember.computed('post.threadId', function () {
			const threadTitle = `/${this.get('post.threadTitle')}`;

			return `${this.get('post.threadCreatedBy.name')}${(this.get('post.threadTitle') ? threadTitle : '')}`;
		})
	}
);
