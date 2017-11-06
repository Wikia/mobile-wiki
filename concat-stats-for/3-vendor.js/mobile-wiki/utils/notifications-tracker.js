define('mobile-wiki/utils/notifications-tracker', ['exports', 'mobile-wiki/utils/track'], function (exports, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.track = track;
	exports.trackImpression = trackImpression;
	exports.trackClick = trackClick;
	exports.trackMarkAsRead = trackMarkAsRead;
	exports.trackMarkAllAsRead = trackMarkAllAsRead;
	exports.trackOpenMenu = trackOpenMenu;


	var labels = {
		'discussion-upvote-reply': 'discussion-upvote-reply',
		'discussion-upvote-post': 'discussion-upvote-post',
		'discussion-reply': 'discussion-reply',
		markAllAsRead: 'mark-all-as-read',
		markAsRead: 'mark-as-read',
		openMenu: 'open-menu'
	},
	    gaCategory = 'on-site-notifications';

	/**
  * @param {string} label
  * @param {string} action
  * @param {Object} params
  *
  * @returns {Object}
  */
	function getTrackingContext(label, action, params) {
		return $.extend({
			action: action,
			category: gaCategory,
			label: labels[label]
		}, params);
	}

	function getGAValueFromUnreadStatus(isUnread) {
		return isUnread ? 1 : 0;
	}

	/**
  * @param {string} label
  * @param {string} action
  * @param {Object} params
  *
  * @returns {void}
  */
	function track(label, action) {
		var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

		(0, _track.track)(getTrackingContext(label, action, params));
	}

	function trackImpression(notification) {
		track(labels[notification.get('type')], 'impression', {
			value: getGAValueFromUnreadStatus(notification.get('isUnread'))
		});
	}

	function trackClick(notification) {
		track(labels[notification.get('type')], 'click', {
			value: getGAValueFromUnreadStatus(notification.get('isUnread'))
		});
	}

	function trackMarkAsRead(notification) {
		track(labels.markAsRead + '-' + labels[notification.get('type')], 'click');
	}

	function trackMarkAllAsRead() {
		track(labels.markAllAsRead, 'click');
	}

	function trackOpenMenu(unreadCount) {
		track(labels.openMenu, 'click', {
			value: unreadCount
		});
	}
});