export default Ember.Mixin.create({
	discussionEditor: Ember.inject.service(),
	modalDialogService: Ember.inject.service('modal-dialog'),
	shouldShowErrorMessage: Ember.computed.alias('modalDialogService.isDisplayed'),
	errorMessage: Ember.computed.alias('modalDialogService.message'),

	/**
	 * Since we cannot use promises rejection because of error substates problem,
	 * this is the place that notifies services about a creation error
	 * @returns {void}
	 */
	errorMessageObserver: Ember.observer('model.errorMessage', function () {
		const modelError = this.get('model.errorMessage');

		if (modelError !== null) {
			this.get('modalDialogService').display(modelError);
			this.get('discussionEditor').set('shouldStopLoading', true);
		}
	})
});
