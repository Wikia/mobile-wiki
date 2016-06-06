import Ember from 'ember';

export default Ember.Mixin.create({
	confirmButtonText: Ember.computed.alias('modalDialog.confirmButtonText'),
	confirmCallback: Ember.computed.alias('modalDialog.confirmCallback'),
	dialogMessage: Ember.computed.alias('modalDialog.message'),
	dialogHeaderText: Ember.computed.alias('modalDialog.header'),
	discussionEditor: Ember.inject.service(),
	isConfirm: Ember.computed.alias('modalDialog.isConfirm'),
	modalDialog: Ember.inject.service(),
	shouldShowDialogMessage: Ember.computed.alias('modalDialog.isDisplayed'),

	/**
	 * Since we cannot use promises rejection because of error substates problem,
	 * this is the place that notifies services about a creation error
	 * @returns {void}
	 */
	dialogMessageObserver: Ember.observer('model.dialogMessage', function () {
		const modelError = this.get('model.dialogMessage');

		if (modelError) {
			this.get('modalDialog').display(i18n.t(modelError, {ns: 'discussion'}));
		}
	})
});
