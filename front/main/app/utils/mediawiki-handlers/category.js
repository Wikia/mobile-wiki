import Ember from 'ember';
import CategoryModel from '../../models/category';

export default class CategoryHandler {
	/**
	 * @returns {string}
	 */
	static getComponentName() {
		return 'mediawiki-category';
	}

	/**
	 * @param {Ember.router} router
	 * @param {*} params
	 * @returns {Ember.model}
	 */
	static getModel(router, params) {
		return CategoryModel.find();
	}

	/**
	 * @param {Ember.router} router
	 * @returns {void}
	 */
	static didTransition(router) {
	}
};
