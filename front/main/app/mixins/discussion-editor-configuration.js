import Ember from 'ember';
import {trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create({
	isEdit: false,
	isReply: false,

	labelMessageKey: null,
	placeholderMessageKey: null,
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

	// is the callout message permitted to be displayed in the editor
	calloutMessagePermitted: false,

	configurations: Ember.Object.create({
		createPost: {
			calloutMessagePermitted: true,
			closeTrackingAction: trackActions.PostClose,
			contentTrackingAction: trackActions.PostContent,
			labelMessageKey: 'editor.post-editor-label',
			placeholderMessageKey: 'editor.post-editor-placeholder-text',
			startTrackingAction: trackActions.PostStart,
			submitMessageKey: 'editor.post-action-button-label',
		},
		createReply: {
			calloutMessagePermitted: true,
			closeTrackingAction: trackActions.ReplyClose,
			contentTrackingAction: trackActions.ReplyContent,
			labelMessageKey: 'editor.reply-editor-label',
			placeholderMessageKey: 'editor.reply-editor-placeholder-text',
			startTrackingAction: trackActions.ReplyStart,
			submitMessageKey: 'editor.reply-action-button-label',
		},
		editPost: {
			closeTrackingAction: trackActions.PostEditClose,
			contentTrackingAction: trackActions.PostEditContent,
			labelMessageKey: 'editor.post-edit-editor-label',
			placeholderMessageKey: 'editor.post-editor-placeholder-text',
			startTrackingAction: trackActions.PostEdit,
			submitMessageKey: 'editor.post-edit-action-button-label',
		},
		editReply: {
			closeTrackingAction: trackActions.ReplyEditClose,
			contentTrackingAction: trackActions.ReplyEditContent,
			labelMessageKey: 'editor.reply-edit-editor-label',
			placeholderMessageKey: 'editor.post-editor-placeholder-text',
			startTrackingAction: trackActions.ReplyEdit,
			submitMessageKey: 'editor.reply-edit-action-button-label',
		},
		editGuidelines: {
			closeTrackingAction: trackActions.GuidelinesEditClose,
			contentTrackingAction: trackActions.GuidelinesEditContent,
			labelMessageKey: 'editor.guidelines-editor-editor-label',
			placeholderMessageKey: 'editor.guidelines-editor-placeholder-text',
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
