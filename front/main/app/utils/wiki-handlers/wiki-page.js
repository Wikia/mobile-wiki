import {namespace as MediawikiNamespace, isContentNamespace} from '../../utils/mediawiki-namespace';
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
	const currentNamespace = data.data.ns;
	let model;

	if (isContentNamespace(currentNamespace)) {
		model = ArticleModel.create(params);
		ArticleModel.setArticle(model, data);

		return model;
	} else if (currentNamespace === MediawikiNamespace.CATEGORY) {
		model = CategoryModel.create(params);
		CategoryModel.setCategory(model, data);

		return model;
	} else {
		return Ember.Object.create();
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
		if (M.prop('articleContentPreloadedInDOM')) {
			const article = ArticleModel.getPreloadedData();

			if (Ember.get(article, 'isContentNamespace')) {
				model = ArticleModel.create(params);
				ArticleModel.setArticle(model, article);

				return resolve(model);
			}
		}

		if (M.prop('exception')) {
			const exception = M.prop('exception');

			M.prop('exception', null);

			return reject(exception);
		}

		Ember.$.getJSON(getURL(params))
			.done((data) => {
				model = getModelForNamespace(data, params);
				resolve(model);
			})
			.fail((err) => {
				if (!err.code && err.status) {
					err.code = err.status;
				}

				reject(err);
			});
	});
}

