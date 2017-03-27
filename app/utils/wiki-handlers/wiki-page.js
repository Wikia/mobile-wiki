import Ember from 'ember';
import ArticleModel from '../../models/wiki/article';
import BaseModel from '../../models/wiki/base';
import CategoryModel from '../../models/wiki/category';
import FileModel from '../../models/wiki/file';
import {namespace as MediawikiNamespace, isContentNamespace} from '../../utils/mediawiki-namespace';
import request from 'ember-ajax/request';
import {buildUrl} from '../../utils/url';

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

	return buildUrl({
		host: params.host,
		path: '/wikia.php',
		query
	});
}

/**
 *
 * @param {Object} data
 * @param {Object} params
 * @param {Array} contentNamespaces
 * @returns {Object}
 */
export function getModelForNamespace(data, params, contentNamespaces) {
	const currentNamespace = data.data.ns;
	let model;

	// Main pages can live in namespaces which are not marked as content
	if (isContentNamespace(currentNamespace, contentNamespaces) || data.data.isMainPage) {
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
		return Ember.Object.create({
			redirectTo: data.data.redirectTo || null
		});
	}
}

export default function getPageModel(params, fastboot, contentNamespaces) {
	const isFastBoot = fastboot.get('isFastBoot'),
		shoebox = fastboot.get('shoebox'),
		articleData = shoebox.retrieve('wikiPage');

	if (!articleData || articleData.data.details.url !== `/wiki/${params.title}`) {
		return request(getURL(params))
			.then((data) => {
				if (isFastBoot) {
					shoebox.put('wikiPage', data);
				}

				return getModelForNamespace(data, params, contentNamespaces);
			})
			.catch((err) => {
				if (!err.code && err.status) {
					err.code = err.status;
				}

				throw new Error(err);
			});
	} else {
		return getModelForNamespace(articleData, params);
	}
}

