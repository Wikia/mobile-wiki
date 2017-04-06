import Ember from 'ember';
import {defineError} from 'ember-exex/error';
import ArticleModel from '../../models/wiki/article';
import CategoryModel from '../../models/wiki/category';
import NotFoundModel from '../../models/wiki/not-found';
import FileModel from '../../models/wiki/file';
import {namespace as MediawikiNamespace, isContentNamespace} from '../../utils/mediawiki-namespace';
import fetch from '../mediawiki-fetch';
import extend from '../../utils/extend';
import {buildUrl} from '../../utils/url';

const {$, Object: EmberObject, get} = Ember;

const WikiPageFetchError = defineError({
	name: 'WikiPageFetchError',
	message: `Wiki page couldn't be fetched`
});

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
		return EmberObject.create({
			redirectTo: data.data.redirectTo || null
		});
	}
}

function getModelForNotFound(params) {
	const model = NotFoundModel.create(params);
	NotFoundModel.setData(model);
	return model;
}

export default function getPageModel(params, fastboot, contentNamespaces) {
	const isFastBoot = fastboot.get('isFastBoot'),
		shoebox = fastboot.get('shoebox');

	if (isFastBoot || !M.initialPageView) {
		return fetch(getURL(params))
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					return response.json().then((responseBody) => {
						throw new WikiPageFetchError({
							code: response.status || 503
						}).withAdditionalData({
							fetchParams: params,
							responseBody,
							url: response.url
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
				if (error.code === 404) {
					const notFoundModel = getModelForNotFound(params);

					if (isFastBoot) {
						shoebox.put('wikiPage', notFoundModel);
						fastboot.set('response.statusCode', error.code);
					}

					return notFoundModel;
				} else {
					// Let ember-error-handler take care of this
					throw error;
				}
			});
	} else {
		const wikiPageData = shoebox.retrieve('wikiPage');

		if (get(wikiPageData, 'data.article')) {
			wikiPageData.data.article.content = $('.article-content').html();
		}

		if (wikiPageData.notFound) {
			return getModelForNotFound(params);
		} else {
			return getModelForNamespace(wikiPageData, params, contentNamespaces);
		}
	}
}

