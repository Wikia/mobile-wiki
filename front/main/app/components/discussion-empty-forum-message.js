export default Ember.Component.extend({
	classNames: ['empty-forum-message'],
	discussionEditor: Ember.inject.service(),

	/**
	 * @returns {void}
	 */
	click() {
		this.get('discussionEditor').activateEditor();
	}
});
