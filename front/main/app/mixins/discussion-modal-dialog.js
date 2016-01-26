export default Ember.Mixin.create({
	confirmButtonText: Ember.computed.alias('modalDialogService.confirmButtonText'),
	confirmCallback: Ember.computed.alias('modalDialogService.confirmCallback'),
	dialogMessage: Ember.computed.alias('modalDialogService.message'),
	dialogHeaderText: Ember.computed.alias('modalDialogService.header'),
	discussionEditor: Ember.inject.service(),
	isConfirm: Ember.computed.alias('modalDialogService.isConfirm'),
	modalDialogService: Ember.inject.service('modal-dialog'),
	shouldShowDialogMessage: Ember.computed.alias('modalDialogService.isDisplayed'),

	/**
	 * Since we cannot use promises rejection because of error substates problem,
	 * this is the place that notifies services about a creation error
	 * @returns {void}
	 */
	dialogMessageObserver: Ember.observer('model.dialogMessage', function () {
		const modelError = this.get('model.dialogMessage');

		if (modelError) {
			this.get('modalDialogService').display(i18n.t(modelError, {ns: 'discussion'}));
			this.get('discussionEditor').set('shouldStopLoading', true);
		}
	})
});
