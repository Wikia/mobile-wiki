import DiscussionEditor from './discussion-editor';

export default DiscussionEditor.extend({

	title: '',

	// Labels below needs to be overrode in subclasses
	titleLabelKey: null,
	titlePlaceholderKey: null,
	messageLabelKey: null,


	actions: {
		onTitleChange(title) {
			this.set('title', title);
		},
		/**
		 * Overrides default discussion editor behaviour. Because editor can have more than one input, textarea,
		 * element should be chosen by user.
		 *
		 * @override
		 */
		focusTextarea() {
		}
	}
});
