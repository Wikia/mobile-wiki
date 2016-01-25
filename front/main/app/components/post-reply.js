import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		isDeleted: Ember.computed.alias('post.isDeleted'),

		linkTitle: Ember.computed('post.threadId', function () {
			const threadTitle = this.get('post.threadTitle') ? `/${this.get('post.threadTitle')}` : '';

			return `${this.get('post.threadCreatedBy.name')}${threadTitle}`;
		})
	}
);
