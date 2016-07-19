import DiscussionEditor from './discussion-editor';

export default DiscussionEditor.extend({

	title: '',

	// Labels below needs to be overwritten in subclasses
	titleLabelKey: null,
	titlePlaceholderKey: null,
	messageLabelKey: null,

	wasFocused: false,

	actions: {
		focusTextarea() {
			if (this.get('wasFocused')) {
				let $target = this.$(event.target);
				let $label = $target.closest('label');
				if (0 === $label.length) {
					$label = $target.children('label:first');
				}
				$label.find('textarea').focus();
			} else {
				this.set('wasFocused', true);
				this.$('textarea:first').focus();
			}
		},
		onTitleChange(title) {
			this.set('title', title);
		}
	}
});
