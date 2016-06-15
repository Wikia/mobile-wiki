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

	init() {
		this._super();

		this.configure();
	},

	configure() {
		if (this.get('isEdit')) {
			// edit
			if (this.get('isReply')) {
				this.setProperties({
					labelMessageKey: 'editor.reply-edit-editor-label',
					placeholderMessageKey: 'editor.post-editor-placeholder-text',
					submitMessageKey: 'editor.reply-edit-action-button-label',
					closeTrackingAction: trackActions.ReplyEditClose,
					contentTrackingAction: trackActions.ReplyEditContent,
					startTrackingAction: trackActions.ReplyEdit,
				});
			} else {
				this.setProperties({
					labelMessageKey: 'editor.post-edit-editor-label',
					placeholderMessageKey: 'editor.post-editor-placeholder-text',
					submitMessageKey: 'editor.post-edit-action-button-label',
					closeTrackingAction: trackActions.PostEditClose,
					contentTrackingAction: trackActions.PostEditContent,
					startTrackingAction: trackActions.PostEdit,
				});
			}
		} else {
			// contribute
			if (this.get('isReply')) {
				this.setProperties({
					labelMessageKey: 'editor.reply-editor-label',
					placeholderMessageKey: 'editor.reply-editor-placeholder-text',
					submitMessageKey: 'editor.reply-action-button-label',
					closeTrackingAction: trackActions.ReplyClose,
					contentTrackingAction: trackActions.ReplyContent,
					startTrackingAction: trackActions.ReplyStart,
				});
			} else {
				this.setProperties({
					labelMessageKey: 'editor.post-editor-label',
					placeholderMessageKey: 'editor.post-editor-placeholder-text',
					submitMessageKey: 'editor.post-action-button-label',
					closeTrackingAction: trackActions.PostClose,
					contentTrackingAction: trackActions.PostContent,
					startTrackingAction: trackActions.PostStart,
				});
			}
		}
	},
});
