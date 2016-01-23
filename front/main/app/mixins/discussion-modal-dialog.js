export default Ember.Mixin.create({
	discussionEditor: Ember.inject.service(),
	modalDialogService: Ember.inject.service('modal-dialog'),
	shouldShowDialogMessage: Ember.computed.alias('modalDialogService.isDisplayed'),
	isConfirm: Ember.computed.alias('modalDialogService.isConfirm'),
	confirmCallback: Ember.computed.alias('modalDialogService.confirmCallback'),
	confirmButtonText: Ember.computed.alias('modalDialogService.confirmButtonText'),
	dialogMessage: Ember.computed.alias('modalDialogService.message'),
	dialogHeader: Ember.computed.alias('modalDialogService.header'),

	/**
	 * Since we cannot use promises rejection because of error substates problem,
	 * this is the place that notifies services about a creation error
	 * @returns {void}
	 */
	dialogMessageObserver: Ember.observer('model.dialogMessage', function () {
		const modelError = this.get('model.dialogMessage');

		if (modelError !== null) {
			this.get('modalDialogService').display(modelError);
			this.get('discussionEditor').set('shouldStopLoading', true);
		}
	})
});
