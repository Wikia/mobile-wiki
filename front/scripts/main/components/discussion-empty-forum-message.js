import DiscussionEditorService from '../services/discussion-editor';

export default Ember.Component.extend({
	discussionEditor: Ember.inject.service(),

	click () {
		this.get('discussionEditor').activateEditor();
	}
});
