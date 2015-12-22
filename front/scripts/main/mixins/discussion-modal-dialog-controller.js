export default Ember.Mixin.create({
	modalDialogService: Ember.inject.service('modal-dialog'),
	shouldShowErrorMessage: Ember.computed.alias('modalDialogService.isDisplayed'),
	errorMessage: Ember.computed.alias('modalDialogService.message'),
});
