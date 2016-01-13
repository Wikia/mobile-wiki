export default Ember.Component.extend({
	classNames: ['empty-forum-message'],
	discussionEditor: Ember.inject.service(),

	click() {
		this.get('discussionEditor').activateEditor();
	}
});
