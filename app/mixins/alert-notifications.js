import Ember from 'ember';

export default Ember.Mixin.create({
	alertNotifications: Ember.A(),

	/**
	 * @param {AlertNotification} alertData
	 * @returns {void}
	 */
	addAlert({
		message,
		type = 'info',
		expiry = 10000,
		unsafe = false,
		callbacks = {},
		persistent = {}
	}) {

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
