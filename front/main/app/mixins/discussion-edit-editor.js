export default Ember.Mixin.create({
	discussionEditEditor: Ember.inject.service(),

	editEditorActive: Ember.computed('discussionEditEditor.isEditorOpen', function() {
		return this.get('discussionEditEditor.isEditorOpen'));
	})
});
