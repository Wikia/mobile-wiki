import CuratedContentModel from '../../models/curated-content';

/**
 * Set curatedContent data if main page has curated content set
 * @param {Object} mainPageModel
 * @returns {Object}
 */
function getCuratedContentModel(mainPageModel) {
	if (mainPageModel.mainPageData.curatedContent) {
		return CuratedContentModel.create({
			type: 'section',
			items: CuratedContentModel.sanitizeItems(mainPageModel.mainPageData.curatedContent)
		});
	}
	return {};
}

export default {
	getCuratedContentModel,
	controllerName: 'main-page',
	viewName: 'mainPage'
};
