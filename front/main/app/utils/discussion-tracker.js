import {track as mercuryTrack} from 'common/utils/track';
import ajaxCall from './ajax-call';

const isClickstreamEnabled = M.prop('clickstream.social.enable'),
	clickStreamURL = M.prop('clickstream.social.url');

export const trackActions = {
	PostCreate: 'PostCreate',
	ReplyCreate: 'ReplyCreate',
};

/**
 * Currently we change mobile to desktop layout
 *
 * @returns {string}
 */
function getGACategory() {
	 return window.innerWidth < 1064 ? 'MobileWebDiscussions' : 'DesktopWebDiscussions';
}

/**
 * Sends an XHR request to track an event in ClickStream with payload
 * compliant with Mobile Apps tracking scheme
 *
 * @param {object} gaContext
 *
 * @returns {void}
 */
function trackInClickStream(gaContext) {
	ajaxCall({
		method: 'POST',
		data: {
			events: [getClickStreamEvent(gaContext)],
			data: {
				platform: 'web'
			}
		},
		url: clickStreamURL,
		success: (data) => {},
		error: (err) => {}
	});
}

/**
 * @param gaContext
 *
 * @returns {object}
 */
function getClickStreamEvent(gaContext) {
	return {
		timestamp: new Date().getTime(),
		country: '',
		beacon_id: '',
		device_language: window.navigator.language,
		category: 'event',
		ga: gaContext
	}
}

/**
 * @param {string} action
 *
 * @returns {object}
 */
function getGAContext(action) {
	return {
		action: action,
		category: getGACategory(),
		label: window.location.hostname
	}
}

/**
 * @param {string} action
 *
 * @returns {void}
 */
export function track(action) {
	const gaContext = getGAContext(action);

	if (isClickStreamEnabled) {
		trackInClickStream(gaContext);
	}

	mercuryTrack(gaContext);
}
