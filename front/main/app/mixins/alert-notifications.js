import Ember from 'ember';

export default Ember.Mixin.create({
	alertNotifications: Ember.A(),

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
