import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';

export default DiscussionEditorComponent.extend({
	classNames: ['mobile-hidden'],

	placeholderText: 'editor.post-editor-placeholder-text',
	submitText: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return 'editor.post-edit-action-button-label';
		} else {
			return 'editor.post-action-button-label';
		}
	}),
	labelText: Ember.computed('isEdit', function () {
		if (this.get('isEdit')) {
			return 'editor.post-edit-editor-label';
		} else {
			return 'editor.post-editor-label';
		}
	}),

	bodyText: Ember.computed('discussionEditor.discussionEntity.rawContent', function () {
		return this.get('discussionEditor.discussionEntity.rawContent') || '';
	}),

	didInsertElement() {
		this._super(...arguments);
		this.get('discussionEditor').on('newPost', () => {
			this.handleNewPostCreated();
		});
	},

	editorServiceStateObserver: Ember.observer('discussionEditor.isEditEditorOpen', function () {
		if (this.get('discussionEditor.isEditEditorOpen')) {
			this.afterOpenActions();
		} else {
			this.afterCloseActions();
		}
	}),

	/**
	 * Initialize onScroll binding for sticky logic
	 * @returns {void}
	 */
	initializeStickyState() {
	},

	/**
	 * Perform animations and logic after post creation
	 * @returns {void}
	 */
	handleNewPostCreated() {
		const newPosts = this.get('posts').filter((post) => post.get('isNew')),
			newPost = newPosts.get('firstObject');

		if (newPost) {
			Ember.$('html, body').animate({scrollTop: 0});
			this.handleNewItemCreated(newPost);
		}
	}
});
