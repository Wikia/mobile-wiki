import CategoryModel from '../../models/mediawiki/category';

/**
 * @returns {Ember.model}
 */
function getModel() {
	return CategoryModel.find();
}

/**
 * @returns {void}
 */
function didTransition() {
}

/**
 * Export Category handler
 */
export default {
	viewName: 'category',
	controllerName: 'category',
	getModel,
	didTransition
};
