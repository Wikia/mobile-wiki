import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';
import DiscussionMoreOptionsMixin from '../mixins/discussion-more-options';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	DiscussionMoreOptionsMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		encodedAuthorName: Ember.computed('author.name', function () {
			return Ember.Handlebars.Utils.escapeExpression(this.get('author.name'));
		}),

		isDeleted: Ember.computed.alias('post.isDeleted'),

		routing: Ember.inject.service('-routing'),

		linkToThreadTitle: Ember.computed('post.threadId', function () {
			const threadTitle = `/${this.get('post.threadTitle')}`;

			return `${this.get('post.threadCreatedBy.name')}${(this.get('post.threadTitle') ? threadTitle : '')}`;
		}),

		post: null,

		actions: {
			/**
			 * @param {number} postId
			 * @param {MouseEvent} event
			 * @returns {void}
			 */
			goToPost(postId, event) {
				event.preventDefault();
				this.attrs.goToPost(postId, event.ctrlKey || event.metaKey);
			}
		}
	}
);
