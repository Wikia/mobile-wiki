import Ember from 'ember';

export default Ember.Mixin.create({
	emailConfirmed: null,

	queryParams: ['emailConfirmed'],

	initEmailConfirmation: Ember.observer('emailConfirmed', function () {
		const emailConfirmedStatus = this.get('emailConfirmed');

		if (emailConfirmedStatus === '1') {
			this.addAlert({
				message: i18n.t('main.email-confirmed-notification', {ns: 'discussion'}),
				type: 'success',
				persistent: true,
				expiry: -1
			});
		} else if (emailConfirmedStatus === '0') {
			this.addAlert({
				message: i18n.t('main.email-confirmation-error', {ns: 'discussion'}),
				type: 'alert',
				persistent: true,
				expiry: -1
			});
		}
	})
});
