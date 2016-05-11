import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';
import {trackActions} from '../utils/discussion-tracker';

export default DiscussionEditorComponent.extend({
	classNames: ['is-edit'],

	discussionEditor: Ember.inject.service('discussion-edit-editor'),

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

	// Tracking action name of closing the editor
	closeTrackingAction: Ember.computed('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			return trackActions.ReplyEditClose;
		} else {
			return trackActions.PostEditClose;
		}
	}),
	// Tracking action name of inserting content into editor
	contentTrackingAction: Ember.computed('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			return trackActions.ReplyEditContent;
		} else {
			return trackActions.PostEditContent;
		}
	}),
	// Tracking action name of opening the editor
	startTrackingAction: Ember.computed('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			return trackActions.ReplyEdit;
		} else {
			return trackActions.PostEdit;
		}
	}),

	didInsertElement() {
		this._super(...arguments);
		this.get('discussionEditor').on('newPost', this, this.handlePostEdited);
	},

	willDestroyElement() {
		this.get('discussionEditor').off('newPost', this, this.handlePostEdited);
	},

	editorServiceStateObserver: Ember.observer('discussionEditor.isEditorOpen', function () {
		if (this.get('discussionEditor.isEditorOpen')) {
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
	handlePostEdited() {
		this.setProperties({
			isLoading: false,
			showSuccess: true
		});

		Ember.run.later(this, () => {
			this.set('showSuccess', false);

			this.get('discussionEditor').toggleEditor(false);
		}, 2000);
	},

	/**
	 * Calls what's needs to be done after editor is opened
	 * @returns {void}
	 */
	afterOpenActions() {
		this._super();
		this.set('bodyText', this.get('discussionEditor.discussionEntity.rawContent') || '');
	},

	actions: {

		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		submit() {
			if (!this.get('submitDisabled')) {
				const action = this.get('discussionEditor.discussionEntity.isReply') ? 'editReply' : 'editPost',
					discussionEntity = this.get('discussionEditor.discussionEntity');

				this.get('discussionEditor').set('isLoading', true);

				this.attrs[action]({
					body: this.get('bodyText'),
					id: discussionEntity.get('isReply') ?
						discussionEntity.get('id') :
						discussionEntity.get('threadId')
				});
			}
		},
	}
});
