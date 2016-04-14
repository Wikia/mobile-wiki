import {track as mercuryTrack} from 'common/utils/track';

const trackActions = {
	PostCreate: 'PostCreate',
	ReplyCreate: 'ReplyCreate',
	UndoUpvotePost: 'UndoUpvotePost',
	UpvotePost: 'UpvotePost',
	LatestPostTapped: 'LatestPostTapped',
	TrendingPostTapped: 'TrendingPostTapped',
	PostShare: 'PostShare',
	PostClose: 'PostClose',
	ReplyClose: 'ReplyClose',
	UserTapped: 'UserTapped',
	PostStart: 'PostStart',
	ReplyStart: 'ReplyStart',
	PostContent: 'PostContent',
	AnonUpvotePost: 'AnonUpvotePost',
	ReplyContent: 'ReplyContent',
	MorePostActions: 'MorePostActions',
	Report: 'Report',
	PostLock: 'PostLock',
	PostUnlock: 'PostUnlock',
	DeleteAllConfirmed: 'DeleteAllConfirmed',
	DeleteAllTapped: 'DeleteAllTapped',
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
		label: window.location.origin
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
