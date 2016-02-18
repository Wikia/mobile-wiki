import CategoryModel from '../../models/category';

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
	viewName: 'mediawiki-category',
	controllerName: 'mediawiki-category',
	getModel,
	didTransition
};
