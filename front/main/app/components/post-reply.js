import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

export default Ember.Component.extend(
	DiscussionParsedContentMixin,
	{
		classNames: ['post-reply'],
		classNameBindings: ['isNew', 'isDeleted', 'isParentDeleted'],

		encodedAuthorName: Ember.computed('author.name', function () {
			return Ember.Handlebars.Utils.escapeExpression(this.get('author.name'));
		}),

		isDeleted: Ember.computed.alias('post.isDeleted'),

		routing: Ember.inject.service('-routing'),

		linkToThread: Ember.computed('post.threadId', function () {
			const url = this.get('routing').router.generate('discussion.post', this.get('post.threadId')),
				  threadAuthor = Ember.Handlebars.Utils.escapeExpression(this.get('post.threadCreatedBy.name')),
				  linkTitle = threadAuthor + (this.get('post.threadTitle') ? '/' + this.get('post.threadTitle') : '');

			return `<a href="${url}">${linkTitle}</a>`;
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
