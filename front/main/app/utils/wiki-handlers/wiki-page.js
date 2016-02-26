import {isContentNamespace, getCurrentNamespace} from '../../utils/mediawiki-namespace';
import ArticleModel from '../../models/wiki/article';
import CategoryModel from '../../models/wiki/category';
import Ember from 'ember';

/**
 *
 * @param {Object} params
 * @returns {string}
 */
function getURL(params) {
	let redirect = '';

	if (params.redirect) {
		redirect += `?redirect=${encodeURIComponent(params.redirect)}`;
	}

	return `${M.prop('apiBase')}/article/${params.title}${redirect}`;
}

/**
 *
 * @param {Object} data
 * @param {Object} params
 * @returns {Object}
 */
function getModelForNamespace(data, params) {
	let model;

	if (isContentNamespace()) {
		model = ArticleModel.create(params);

		ArticleModel.setArticle(model, data);
		return model;
	} else {
		switch (getCurrentNamespace()) {
			case 14:
				model = CategoryModel.create(params);
				CategoryModel.setCategory(model, data);
				return model;
			default:
				return Ember.Object.create();
		}
	}
}

/**
 *
 * @param {Object} params
 * @returns {Ember.RSVP.Promise}
 */
export default function getPageModel(params) {
	let model;

	return new Ember.RSVP.Promise((resolve, reject) => {
		if (isContentNamespace()) {
			if (M.prop('articleContentPreloadedInDOM') && !M.prop('asyncArticle')) {
				model = ArticleModel.create(params);

				ArticleModel.setArticle(model);
				return resolve(model);
			}
		}

		Ember.$.getJSON(getURL(params))
			.done((data) => {
				// @todo - https://wikia-inc.atlassian.net/browse/XW-1151 (this should be handled differently)
				M.prop('mediaWikiNamespace', data.data.ns, true);

				model = getModelForNamespace(data, params);
				resolve(model);
			})
			.fail((err) => {
				/**
				 * Temporary solution until we can make error states work
				 * ideally we should reject on errors
				 *
				 * On error always show article (for now)
				 */
				if (err.status === 404) {
					const model = ArticleModel.create(params);

					ArticleModel.setArticle(model, err.responseJSON);
					resolve(model);
				} else {
					reject(err);
				}
			});
	});
}

