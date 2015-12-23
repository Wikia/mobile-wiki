export default Ember.Component.extend({
	classNames: ['discussion-error-dialog'],
	isDialogVisible: false,
	modalDialogService: Ember.inject.service('modal-dialog'),

	actions: {
		close(){
			this.set('isDialogVisible', false);
			this.get('modalDialogService').close();
		}
	}
});
