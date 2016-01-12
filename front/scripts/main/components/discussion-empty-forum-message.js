export default Ember.Component.extend({
	discussionEditor: Ember.inject.service(),
	classNames: ['empty-forum-message'],

	click() {
		this.get('discussionEditor').activateEditor();
	}
});
