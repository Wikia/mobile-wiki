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
	const query = {
		controller: 'MercuryApi',
		method: 'getPage',
		title: params.title,
	};

	if (params.redirect) {
		query.redirect = `?redirect=${encodeURIComponent(params.redirect)}`;
	}

	return M.buildUrl({
		path: '/wikia.php',
		query
	});
}

/**
 *
 * @param {Object} data
 * @param {Object} params
 * @returns {Object}
 */
export function getModelForNamespace(data, params) {
	const currentNamespace = data.data.ns;
	let model;

	// Main pages can live in namespaces which are not marked as content
	if (isContentNamespace(currentNamespace) || data.data.isMainPage) {
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
			// This happens also for categories with article
			const preloadedData = ArticleModel.getPreloadedData();

			model = getModelForNamespace(preloadedData, params);

			return resolve(model);
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

