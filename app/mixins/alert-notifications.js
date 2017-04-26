import Ember from 'ember';

const {A, Mixin} = Ember;

export default Mixin.create({
	alertNotifications: null,

	init() {
		this._super(...arguments);
		this.set('alertNotifications', A());
	},

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

	clearNotifications() {
		const notifications = this.get('alertNotifications'),
			updatedNotifications = notifications.filter((item) => item.persistent);

		this.set('alertNotifications', updatedNotifications);
	}
});
