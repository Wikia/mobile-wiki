export default Ember.Mixin.create({
	discussionEditEditor: Ember.inject.service(),

	editEditorActive: Ember.computed.alias('discussionEditEditor.isEditorOpen'),
});
