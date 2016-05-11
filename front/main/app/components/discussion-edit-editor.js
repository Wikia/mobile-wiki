import Ember from 'ember';
import DiscussionEditorComponent from './discussion-editor';
import {trackActions} from '../utils/discussion-tracker';

export default DiscussionEditorComponent.extend({
	classNames: ['is-edit'],

	discussionEditor: Ember.inject.service('discussion-edit-editor'),

	placeholderText: 'editor.post-editor-placeholder-text',

	didInsertElement() {
		this._super(...arguments);
		this.get('discussionEditor').on('newPost', this, this.handlePostEdited);
	},

	willDestroyElement() {
		this.get('discussionEditor').off('newPost', this, this.handlePostEdited);
	},

	isReplyObserver: Ember.observer('discussionEditor.discussionEntity.isReply', function () {
		if (this.get('discussionEditor.discussionEntity.isReply')) {
			this.setProperties({
				closeTrackingAction: trackActions.ReplyEditClose,
				contentTrackingAction: trackActions.ReplyEditContent,
				labelText: 'editor.reply-edit-editor-label',
				startTrackingAction: trackActions.ReplyEdit,
				submitText: 'editor.reply-edit-action-button-label',
			});
		} else {
			this.setProperties({
				closeTrackingAction: trackActions.PostEditClose,
				contentTrackingAction: trackActions.PostEditContent,
				labelText: 'editor.post-edit-editor-label',
				startTrackingAction: trackActions.PostEdit,
				submitText: 'editor.post-edit-action-button-label',
			});
		}
	}),

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
	initializeStickyState() {},

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
	 * Open editor and set bodyText to the right value
	 * @returns {void}
	 */
	afterOpenActions() {
		this._super();
		this.set('bodyText', this.getWithDefault('discussionEditor.discussionEntity.rawContent', ''));
	},

	actions: {

		/**
		 * Send request to model to create new post and start animations
		 * @returns {void}
		 */
		submit() {
			if (!this.get('submitDisabled')) {
				const discussionEntity = this.get('discussionEditor.discussionEntity');

				this.get('discussionEditor').set('isLoading', true);

				if (discussionEntity.get('isReply')) {
					this.get('editReply')({
						body: this.get('bodyText'),
						id: discussionEntity.get('id'),
					});
				} else {
					this.get('editPost')({
						body: this.get('bodyText'),
						id: discussionEntity.get('threadId'),
					});
				}
			}
		},
	}
});
