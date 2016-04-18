export default Ember.Mixin.create({
	discussionEditor: Ember.inject.service(),

	editEditorActive: Ember.computed.alias('discussionEditor.isEditEditorOpen'),
});
