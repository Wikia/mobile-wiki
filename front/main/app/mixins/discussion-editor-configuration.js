import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	isEdit: false,
	isReply: false,

	editorLabelKey: null,
	messagePlaceholderKey: null,
	submitMessageKey: null,

	// Tracking action name of closing the editor
	closeTrackingAction: null,
	// Tracking action name of inserting content into editor
	contentTrackingAction: null,
	// Tracking action name of opening the editor
	startTrackingAction: null,

	configurationObeserver: Ember.observer('isEdit', 'isReply', function () {
		this.configure();
	}),

	configurations: Ember.Object.create({
		createPost: {
			editorLabelKey: 'editor.post-editor-label',
			titleLabelKey: 'editor.post-editor-title-label',
			titlePlaceholderKey: 'editor.post-editor-title-placeholder-text',
			messageLabelKey: 'editor.post-editor-body-label',
			messagePlaceholderKey: 'editor.post-editor-body-placeholder-text',
			submitMessageKey: 'editor.post-action-button-label',
			closeTrackingAction: trackActions.PostClose,
			contentTrackingAction: trackActions.PostContent,
			startTrackingAction: trackActions.PostStart,
		},
		createReply: {
			editorLabelKey: 'editor.reply-editor-label',
			messagePlaceholderKey: 'editor.reply-editor-placeholder-text',
			submitMessageKey: 'editor.reply-action-button-label',
			closeTrackingAction: trackActions.ReplyClose,
			contentTrackingAction: trackActions.ReplyContent,
			startTrackingAction: trackActions.ReplyStart,
		},
		editPost: {
			editorLabelKey: 'editor.post-edit-editor-label',
			messagePlaceholderKey: 'editor.post-editor-placeholder-text',
			submitMessageKey: 'editor.post-edit-action-button-label',
			closeTrackingAction: trackActions.PostEditClose,
			contentTrackingAction: trackActions.PostEditContent,
			startTrackingAction: trackActions.PostEdit,
		},
		editReply: {
			editorLabelKey: 'editor.reply-edit-editor-label',
			messagePlaceholderKey: 'editor.post-editor-placeholder-text',
			submitMessageKey: 'editor.reply-edit-action-button-label',
			closeTrackingAction: trackActions.ReplyEditClose,
			contentTrackingAction: trackActions.ReplyEditContent,
			startTrackingAction: trackActions.ReplyEdit,
		},
		editGuidelines: {
			closeTrackingAction: trackActions.GuidelinesEditClose,
			contentTrackingAction: trackActions.GuidelinesEditContent,
			editorLabelKey: 'editor.guidelines-editor-editor-label',
			messagePlaceholderKey: 'editor.guidelines-editor-placeholder-text',
			startTrackingAction: trackActions.GuidelinesEdit,
			submitMessageKey: 'editor.guidelines-editor-action-button-label',
			titleMessageKey: 'editor.guidelines-editor-title',
		},
	}),

	init() {
		this._super();

		this.configure();
	},

	configure() {
		const configurations = this.get('configurations');

		if (this.get('isEdit')) {
			if (this.get('isReply')) {
				// edit reply
				this.setProperties(configurations.get('editReply'));
			} else if (this.get('isGuidelinesEditor')) {
				// maybe it a surprise, but: edit Guidelines
				this.setProperties(configurations.get('editGuidelines'));
			} else {
				// edit post
				this.setProperties(configurations.get('editPost'));
			}
		} else if (this.get('isReply')) {
			// create reply
			this.setProperties(configurations.get('createReply'));
		} else {
			// create post
			this.setProperties(configurations.get('createPost'));
		}
	},
});
