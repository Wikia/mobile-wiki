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

		linkToThreadTitle: Ember.computed('post.threadId', function () {
			const threadAuthor = this.get('post.threadCreatedBy.name'),
				threadTitle = this.get('post.threadTitle');

			return threadAuthor + (threadTitle ? '/' + threadTitle : '');
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
