export default Ember.Component.extend({
	classNames: ['empty-forum-message'],

	/**
	 * @returns {void}
	 */
	click() {
		this.sendAction('setEditorActive', 'contributeEditor', true);
	}
});
