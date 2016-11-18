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
	PostEditTitle: 'PostEditTitle',
	PostTitle: 'PostTitle',
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
	CategoriesCollapsed: 'CategoriesCollapsed',
	CategoriesUncollapsed: 'CategoriesUncollapsed',
	ReportedFilterCollapsed: 'ReportedFilterCollapsed',
	ReportedFilterUncollapsed: 'ReportedFilterUncollapsed',
	CategoriesResetTapped: 'CategoriesResetTapped',
	ReportDetailsModalOpen: 'ReportDetailsModalOpen',
	EditCategoriesButtonTapped: 'EditCategoriesButtonTapped',
	AddCategoryButtonTapped: 'AddCategoryButtonTapped',
	DeleteCategoryModalOpen: 'TrashCategoryButtonTapped',
	DeleteCategoryModalClose: 'DeleteCategoryModalClose',
	DeleteAndMoveCategoryButtonTapped: 'DeleteAndMoveCategoryButtonTapped',
	GuidelinesLinkTapped: 'GuidelinesLinkTapped',
	GuidelinesLinkWelcomeTapped: 'GuidelinesLinkWelcomeTapped',
	GuidelinesEditClose: 'GuidelinesEditClose',
	GuidelinesEditContent: 'GuidelinesEditContent',
	GuidelinesEdit: 'GuidelinesEdit',
	GuidelinesEditSave: 'GuidelinesEditSave',
	WelcomeMessageClose: 'WelcomeMessageClose',
	PostLoadMore: 'PostLoadMore',
	PostMore: 'PostMore',
	EditorCalloutMessageClose: 'EditorCalloutMessageClose',
	EditorCalloutGuidelinesLinkTapped: 'EditorCalloutGuidelinesLinkTapped',
	EditCommunityBadgeButtonTapped: 'EditCommunityBadgeButtonTapped',
	EditCommunityBadgeFileDropped: 'EditCommunityBadgeFileDropped',
	EditCommunityBadgeFilePasted: 'EditCommunityBadgeFilePasted',
	EditCommunityBadgeImagePreview: 'EditCommunityBadgeImagePreview',
	EditCommunityBadgeEscapeKeyHit: 'EditCommunityBadgeEscapeKeyHit',
	CommunityBadgeSave: 'CommunityBadgeSave',
	CommunityBadgeSaveFailure: 'CommunityBadgeSaveFailure',
	CommunityBadgeClicked: 'CommunityBadgeClicked',
	CommunityNameClicked: 'CommunityNameClicked',
	EditDiscussionsHeaderButtonTapped: 'EditDiscussionsHeaderButtonTapped',
	EditDiscussionsHeaderFileDropped: 'EditDiscussionsHeaderFileDropped',
	EditDiscussionsHeaderFilePasted: 'EditDiscussionsHeaderFilePasted',
	EditDiscussionsHeaderImagePreview: 'EditDiscussionsHeaderImagePreview',
	EditDiscussionsHeaderEscapeKeyHit: 'EditDiscussionsHeaderEscapeKeyHit',
	DiscussionsHeaderSave: 'DiscussionsHeaderSave',
	DiscussionsHeaderSaveFailure: 'DiscussionsHeaderSaveFailure',
	DiscussionsHeaderTextClicked: 'DiscussionsHeaderTextClicked',
	DiscussionsHeaderPostcountClicked: 'DiscussionsHeaderPostcountClicked',
	DiscussionsHeaderAvatarClicked: 'DiscussionsHeaderAvatarClicked',
	PostCategoryAdded: 'PostCategoryAdded',
	PostCategoryEdited: 'PostCategoryEdited',
	WikiHomeLinkClicked: 'WikiHomeLinkClicked',
	SideButtonClicked: 'SideButtonClicked',
	MobileHeaderCommunityNameClicked: 'MobileHeaderCommunityNameClicked',
	PageView: 'PageView',
	PostLightboxOpen: 'PostLightboxOpen',
	PostLightboxButtonClose: 'PostLightboxButtonClose',
	PostLightboxKeyClose: 'PostLightboxKeyClose',
	PostLightboxOverlayClose: 'PostLightboxOverlayClose'
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
 * @param {string} params
 *
 * @returns {Object}
 */
function getTrackingContext(action, params) {
	return $.extend({
		action,
		category: getGACategory(),
		label: window.location.origin
	}, params);
}

/**
 * @param {string} action
 * @param {object} params
 *
 * @returns {void}
 */
export function track(action, params) {
	mercuryTrack(
		getTrackingContext(action, params),
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
