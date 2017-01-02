import Ember from 'ember';

export default Ember.Mixin.create({
	emailConfirmed: null,

	queryParams: ['emailConfirmed'],

	onInit: Ember.on('init', function () {
		const emailConfirmedStatus = this.get('emailConfirmed');

		if (emailConfirmedStatus === '1') {
			this.addAlert({
				message: i18n.t('', {ns: 'discussion'}),
				type: 'alert'
			});
		} else if (emailConfirmedStatus === '0') {
			this.addAlert({
				message: i18n.t('', {ns: 'discussion'}),
				type: 'error'
			});
		}
	}),

	/**
	 * @param {AlertNotification} alertData
	 * @returns {void}
	 */
	addAlert(alertData) {
		const message = alertData.message,
			type = alertData.type || '',
			expiry = alertData.expiry || 10000,
			unsafe = alertData.unsafe || false,
			callbacks = alertData.callbacks || {},
			persistent = alertData.persistent || false;

		this.get('alertNotifications').pushObject({
			message,
			type,
			expiry,
			unsafe,
			callbacks,
			persistent
		});
	},

	/**
	 * @returns {void}
	 */
	clearNotifications() {
		const notifications = this.get('alertNotifications'),
			updatedNotifications = notifications.filter((item) => item.persistent);

		this.set('alertNotifications', updatedNotifications);
	}
});
