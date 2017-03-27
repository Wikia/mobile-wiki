import {track as mercuryTrack} from 'common/utils/track';

const labels = {
		'discussion-upvote-reply': 'discussion-upvote-reply',
		'discussion-upvote-post': 'discussion-upvote-post',
		'discussion-reply': 'discussion-reply',
		'mark-all-as-read': 'mark-all-as-read',
		'mark-as-read': 'mark-as-read',
		'open-menu': 'open-menu',
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
		action,
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
export function track(label, action, params = null) {
	mercuryTrack(
		getTrackingContext(label, action, params),
	);
}

export function trackImpression(notification) {
	track(
		labels[notification.get('type')],
		'impression',
		{
			value: getGAValueFromUnreadStatus(notification.get('isUnread'))
		}
	);
}

export function trackClick(notification) {
	track(
		labels[notification.get('type')],
		'click',
		{
			value: getGAValueFromUnreadStatus(notification.get('isUnread'))
		}
	);
}

export function trackMarkAsRead(notification) {
	track(
		`${labels['mark-as-read']}-${labels[notification.get('type')]}`,
		'click',
	);
}

export function trackMarkAllAsRead() {
	track(
		labels['mark-all-as-read'],
		'click',
	);
}
