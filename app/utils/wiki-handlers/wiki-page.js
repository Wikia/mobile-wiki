import Ember from 'ember';
import {defineError} from 'ember-exex/error';
import ArticleModel from '../../models/wiki/article';
import CategoryModel from '../../models/wiki/category';
import FileModel from '../../models/wiki/file';
import isInitialPageView from '../../utils/initial-page-view';
import {namespace as MediawikiNamespace, isContentNamespace} from '../../utils/mediawiki-namespace';
import fetch from '../mediawiki-fetch';
import {getFetchErrorMessage, WikiPageFetchError} from '../../utils/errors';
import extend from '../../utils/extend';
import {buildUrl} from '../../utils/url';

const {$, Object: EmberObject, get} = Ember;

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
		//query
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
		return EmberObject.create({
			redirectTo: data.data.redirectTo || null
		});
	}
}

export default function getPageModel(params, fastboot, contentNamespaces) {
	const isFastBoot = fastboot.get('isFastBoot'),
		shoebox = fastboot.get('shoebox');

	if (isFastBoot || !isInitialPageView()) {
		const url = getURL(params);

		return fetch(url)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return getFetchErrorMessage(response).then((responseBody) => {
						throw new WikiPageFetchError({
							code: response.status || 503
						}).withAdditionalData({
							responseBody,
							requestUrl: url,
							responseUrl: response.url
						});
					});
				}
			})
			.then((data) => {
				if (isFastBoot) {
					const dataForShoebox = extend({}, data);

					if (dataForShoebox.data && dataForShoebox.data.article) {
						// Remove article content so it's not duplicated in shoebox and HTML
						delete dataForShoebox.data.article.content;
					}

					shoebox.put('wikiPage', dataForShoebox);
				}

				return getModelForNamespace(data, params, contentNamespaces);
			})
			.catch((error) => {
				if (isFastBoot) {
					shoebox.put('wikiPageError', error);
					fastboot.set('response.statusCode', error.code || 503);
				}

				throw error;
			});
	} else {
		const wikiPageData = shoebox.retrieve('wikiPage'),
			wikiPageError = shoebox.retrieve('wikiPageError');

		// There is no way to remove stuff from shoebox, so ignore it on the consecutive page views
		if (wikiPageError && isInitialPageView()) {
			throw wikiPageError;
		}

		if (get(wikiPageData, 'data.article')) {
			wikiPageData.data.article.content = $('.article-content').html();
		}

		return getModelForNamespace(wikiPageData, params, contentNamespaces);
	}
}

