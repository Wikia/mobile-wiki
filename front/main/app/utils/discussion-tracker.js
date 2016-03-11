import {track as mercuryTrack} from 'common/utils/track';

const trackActions = {
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
	mercuryTrack(
		getGAContext(action)
	);
}

export {trackActions};
