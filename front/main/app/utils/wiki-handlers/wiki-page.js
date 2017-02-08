import Ember from 'ember';
import ArticleModel from '../../models/wiki/article';
import BaseModel from '../../models/wiki/base';
import CategoryModel from '../../models/wiki/category';
import FileModel from '../../models/wiki/file';
import {namespace as MediawikiNamespace, isContentNamespace} from '../../utils/mediawiki-namespace';
import request from 'ember-ajax/request';

/**
 *
 * @param {Object} params
 * @returns {string}
 */
function getURL(params) {
	const query = {
		controller: 'MercuryApi',
		method: 'getPage',
		// We need to decode title because MW sends encoded content
		// It's only necessary in case of in-content links
		title: decodeURIComponent(params.title),
	};

	if (params.redirect) {
		query.redirect = params.redirect;
	}

	if (params.page) {
		query.categoryMembersPage = params.page;
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
		ArticleModel.setData(model, data);

		return model;
	} else if (currentNamespace === MediawikiNamespace.CATEGORY) {
		model = CategoryModel.create(params);
		CategoryModel.setData(model, data);

		return model;
	} else if (currentNamespace === MediawikiNamespace.FILE) {
		model = FileModel.create(params);
		FileModel.setData(model, data);

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

	if (M.prop('articleContentPreloadedInDOM')) {
		const preloadedData = BaseModel.getPreloadedData();
		model = getModelForNamespace(preloadedData, params);

		return Ember.RSVP.resolve(model);
	}

	if (M.prop('exception')) {
		const exception = M.prop('exception');

		M.prop('exception', null);

		return Ember.RSVP.reject(exception);
	}

	return request(getURL(params))
		.then((data) => {
			model = getModelForNamespace(data, params);

			return model;
		})
		.catch((err) => {
			if (!err.code && err.status) {
				err.code = err.status;
			}

			throw new Error(err);
		});
}

