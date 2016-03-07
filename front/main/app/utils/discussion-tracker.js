import {track as mercuryTrack} from 'common/utils/track';
import ajaxCall from './ajax-call';

const isClickstreamEnabled = M.prop('clickstream.social.enable'),
	clickstreamURL = M.prop('clickstream.social.url'),
	trackActions = {
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
 * @param {object} gaContext
 *
 * @returns {object}
 */
function getClickstreamEvent(gaContext) {
	return {
		timestamp: new Date().getTime(),
		country: '',
		beacon_id: '',
		device_language: window.navigator.language,
		category: 'event',
		ga: gaContext
	};
}

/**
 * Sends an XHR request to track an event in Clickstream with payload
 * compliant with Mobile Apps tracking scheme
 *
 * @param {object} gaContext
 *
 * @returns {void}
 */
function trackInClickstream(gaContext) {
	ajaxCall({
		method: 'POST',
		data: JSON.stringify({
			events: [
				getClickstreamEvent(gaContext)
			],
		}),
		url: clickstreamURL,
	});
}

/**
 * @param {string} action
 *
 * @returns {object}
 */
function getGAContext(action) {
	return {
		action,
		category: getGACategory(),
		label: window.location.hostname
	};
}

/**
 * @param {string} action
 *
 * @returns {void}
 */
export function track(action) {
	const gaContext = getGAContext(action);

	if (isClickstreamEnabled) {
		trackInClickstream(gaContext);
	}

	mercuryTrack(gaContext);
}

export {trackActions};
