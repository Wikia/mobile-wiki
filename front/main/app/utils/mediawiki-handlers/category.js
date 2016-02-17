import CategoryModel from '../../models/category';

/**
 * @returns {string}
 */
function getComponentName() {
	return 'mediawiki-category';
}

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
	getComponentName,
	getModel,
	didTransition
};
