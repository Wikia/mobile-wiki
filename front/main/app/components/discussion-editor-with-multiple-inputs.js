import DiscussionEditor from './discussion-editor';

export default DiscussionEditor.extend({

	title: '',

	// Labels below needs to be overwritten in subclasses
	titleLabelKey: null,
	titlePlaceholderKey: null,
	messageLabelKey: null,

	actions: {
		onTitleChange(title) {
			this.set('title', title);
		}
	}
});
