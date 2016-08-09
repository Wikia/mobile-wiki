import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	isEdit: false,
	isReply: false,

	collapsedEditorLabelKey: null,
	editorLabelKey: null,
	messageLabelKey: null,
	messagePlaceholderKey: null,
	titleLabelKey: null,
	titlePlaceholderKey: null,
	submitMessageKey: null,

	// Tracking action name of closing the editor
	closeTrackingAction: null,
	// Tracking action name of inserting content into editor
	contentTrackingAction: null,
	// Tracking action name of opening the editor
	startTrackingAction: null,
	// Tracking action name of inserting title into editor
	titleTrackingAction: null,

	configurationObeserver: Ember.observer('isEdit', 'isReply', function () {
		this.configure();
	}),

	// is the callout message permitted to be displayed in the editor
	calloutMessagePermitted: false,

	configurations: Ember.Object.create({
		createPost: {
			calloutMessagePermitted: true,
			closeTrackingAction: trackActions.PostClose,
			collapsedEditorLabelKey: 'editor.post-editor-collapsed-label',
			contentTrackingAction: trackActions.PostContent,
			editorLabelKey: 'editor.post-editor-label',
			messageLabelKey: 'editor.post-editor-description-label',
			messagePlaceholderKey: 'editor.post-editor-description-placeholder-text',
			startTrackingAction: trackActions.PostStart,
			submitMessageKey: 'editor.post-action-button-label',
			titleLabelKey: 'editor.post-editor-title-label',
			titlePlaceholderKey: 'editor.post-editor-title-placeholder-text',
			titleTrackingAction: trackActions.PostTitle,
		},
		createReply: {
			calloutMessagePermitted: true,
			closeTrackingAction: trackActions.ReplyClose,
			contentTrackingAction: trackActions.ReplyContent,
			editorLabelKey: 'editor.reply-editor-label',
			messageLabelKey: 'editor.reply-editor-label',
			messagePlaceholderKey: 'editor.reply-editor-placeholder-text',
			startTrackingAction: trackActions.ReplyStart,
			submitMessageKey: 'editor.reply-action-button-label',
		},
		editPost: {
			closeTrackingAction: trackActions.PostEditClose,
			contentTrackingAction: trackActions.PostEditContent,
			editorLabelKey: 'editor.post-edit-editor-label',
			messageLabelKey: 'editor.post-editor-description-label',
			messagePlaceholderKey: 'editor.post-editor-description-placeholder-text',
			startTrackingAction: trackActions.PostEdit,
			submitMessageKey: 'editor.post-edit-action-button-label',
			titleLabelKey: 'editor.post-editor-title-label',
			titlePlaceholderKey: 'editor.post-editor-title-placeholder-text',
			titleTrackingAction: trackActions.PostEditTitle,
		},
		editReply: {
			closeTrackingAction: trackActions.ReplyEditClose,
			contentTrackingAction: trackActions.ReplyEditContent,
			editorLabelKey: 'editor.reply-edit-editor-label',
			messagePlaceholderKey: 'editor.post-editor-placeholder-text',
			startTrackingAction: trackActions.ReplyEdit,
			submitMessageKey: 'editor.reply-edit-action-button-label',
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
