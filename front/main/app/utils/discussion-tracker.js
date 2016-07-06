import {track as mercuryTrack} from 'common/utils/track';

const trackActions = {
	PostCreate: 'PostCreate',
	PostEdit: 'PostEdit',
	PostEditSave: 'PostEditSave',
	ReplyCreate: 'ReplyCreate',
	ReplyEdit: 'ReplyEdit',
	ReplyEditSave: 'ReplyEditSave',
	UndoUpvotePost: 'UndoUpvotePost',
	UpvotePost: 'UpvotePost',
	LatestPostTapped: 'LatestPostTapped',
	TrendingPostTapped: 'TrendingPostTapped',
	PostShare: 'PostShare',
	PostClose: 'PostClose',
	PostEditClose: 'PostEditClose',
	ReplyClose: 'ReplyClose',
	ReplyEditClose: 'ReplyEditClose',
	PostStart: 'PostStart',
	ReplyStart: 'ReplyStart',
	PostContent: 'PostContent',
	PostEditContent: 'PostEditContent',
	AnonUpvotePost: 'AnonUpvotePost',
	ReplyContent: 'ReplyContent',
	ReplyEditContent: 'ReplyEditContent',
	MorePostActions: 'MorePostActions',
	Report: 'Report',
	PostLock: 'PostLock',
	PostUnlock: 'PostUnlock',
	DeleteAllConfirmed: 'DeleteAllConfirmed',
	DeleteAllTapped: 'DeleteAllTapped',
	ReplyButtonTapped: 'ReplyButtonTapped',
	OGTapped: 'OGTapped',
	OGCreated: 'OGCreated',
	OGRemoved: 'OGRemoved',
	CategoryTapped: 'CategoryTapped',
	AllCategoriesTapped: 'AllCategoriesTapped',
	CategoriesCollaped: 'CategoriesCollaped',
	CategoriesUncollaped: 'CategoriesUncollaped',
	ReportedFilterCollaped: 'ReportedFilterCollaped',
	ReportedFilterUncollaped: 'ReportedFilterUncollaped',
	CategoriesResetTapped: 'CategoriesResetTapped',
	ReportDetailsModalOpen: 'ReportDetailsModalOpen',
	GuidelinesLinkTapped: 'GuidelinesLinkTapped',
	GuidelinesLinkWelcomeTapped: 'GuidelinesLinkWelcomeTapped',
	GuidelinesEditClose: 'GuidelinesEditClose',
	GuidelinesEditContent: 'GuidelinesEditContent',
	GuidelinesEdit: 'GuidelinesEdit',
	WelcomeMessageClose: 'WelcomeMessageClose'
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
 * @returns {Object}
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

/**
 * @param {string} network
 *
 * @returns {string}
 */
export function getTrackActionForShareNetwork(network) {
	return `${network}-ShareButtonTapped`;
}

export {trackActions};
