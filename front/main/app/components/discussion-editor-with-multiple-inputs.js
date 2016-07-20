import DiscussionEditor from './discussion-editor';

export default DiscussionEditor.extend({

	title: '',

	// Labels below needs to be overwritten in subclasses
	titleLabelKey: null,
	titlePlaceholderKey: null,
	messageLabelKey: null,

	/**
	 * Overridden to clear title also.
	 */
	afterSuccess() {
		this.setProperties({
			content: '',
			title: '',
			showSuccess: false,
		});
		this.sendAction('setEditorActive', this.get('editorType'), false);
		this.scrollAfterEntityAdded();
	},

	focusOnNearestTextarea(event) {
		if (this.get('isActive')) {
			let $target = this.$(event.target);
			let $label = $target.closest('label');
			if (Ember.isEmpty($label)) {
				$label = $target.children('label:first');
			}
			$label.find('textarea').focus();
		} else {
			this.$('textarea:first').focus();
		}
	},

	actions: {
		onTitleChange(title) {
			this.set('title', title);
		}
	}
});
