import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';

export default DiscussionEditorComponent.extend({
	discussionEditor: Ember.inject.service(),

	placeholderText: 'editor.post-editor-placeholder-text',
	submitText: Ember.computed('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			return 'editor.reply-edit-action-button-label';
		} else {
			return 'editor.post-edit-action-button-label';
		}
	}),
	labelText: Ember.computed('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			return 'editor.reply-edit-editor-label';
		} else {
			return 'editor.post-edit-editor-label';
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
			this.get('discussionEditor').setDiscussionEntity(null);
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
		this.setProperties({
			isLoading: false,
			showSuccess: true
		});

		Ember.run.later(this, () => {
			this.set('showSuccess', false);

			this.get('discussionEditor').toggleEditor(false);
		}, 2000);
	},
});
