define('mobile-wiki/mixins/alert-notifications', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var A = Ember.A;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		alertNotifications: null,

		init: function init() {
			this._super.apply(this, arguments);
			this.set('alertNotifications', A());
		},
		addAlert: function addAlert(_ref) {
			var message = _ref.message,
			    _ref$type = _ref.type,
			    type = _ref$type === undefined ? 'info' : _ref$type,
			    _ref$expiry = _ref.expiry,
			    expiry = _ref$expiry === undefined ? 10000 : _ref$expiry,
			    _ref$unsafe = _ref.unsafe,
			    unsafe = _ref$unsafe === undefined ? false : _ref$unsafe,
			    _ref$callbacks = _ref.callbacks,
			    callbacks = _ref$callbacks === undefined ? {} : _ref$callbacks,
			    _ref$persistent = _ref.persistent,
			    persistent = _ref$persistent === undefined ? {} : _ref$persistent;

			this.get('alertNotifications').pushObject({
				message: message,
				type: type,
				expiry: expiry,
				unsafe: unsafe,
				callbacks: callbacks,
				persistent: persistent
			});
		},
		clearNotifications: function clearNotifications() {
			var notifications = this.get('alertNotifications'),
			    updatedNotifications = notifications.filter(function (item) {
				return item.persistent;
			});

			this.set('alertNotifications', updatedNotifications);
		}
	});
});