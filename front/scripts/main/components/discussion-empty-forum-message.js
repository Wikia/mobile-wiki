export default Ember.Component.extend({
	discussionEditor: Ember.inject.service(),

	click() {
		this.get('discussionEditor').activateEditor();
	}
});
