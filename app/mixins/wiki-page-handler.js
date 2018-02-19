import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import EmberObject, {get} from '@ember/object';
import {getOwner} from '@ember/application';
import ArticleModel from '../models/wiki/article';
import BlogModel from '../models/wiki/blog';
import CategoryModel from '../models/wiki/category';
import FileModel from '../models/wiki/file';
import {namespace as MediawikiNamespace, isContentNamespace} from '../utils/mediawiki-namespace';
import fetch from '../utils/mediawiki-fetch';
import {getFetchErrorMessage, WikiPageFetchError} from '../utils/errors';
import extend from '../utils/extend';
import {buildUrl} from '../utils/url';

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

	if (params.noads) {
		query.noads = params.noads;
	}

	if (params.noexternals) {
		query.noexternals = params.noexternals;
	}

	if (params.page) {
		query.categoryMembersPage = params.page;
	}

	// this is pseudo-versioning query param for collapsible sections (XW-4393)
	// should be removed after all App caches are invalidated
	query.collapsibleSections = 1;

	return buildUrl({
		host: params.host,
		path: '/wikia.php',
		query
	});
}

export default Mixin.create({
	fastboot: service(),
	wikiVariables: service(),
	simpleStore: service(),

	getPageModel(params) {
		const isFastBoot = this.get('fastboot.isFastBoot'),
			shoebox = this.get('fastboot.shoebox'),
			contentNamespaces = this.get('wikiVariables.contentNamespaces'),
			isInitialPageView = this.get('initialPageView').isInitialPageView();

		if (isFastBoot || !isInitialPageView) {
			params.noads = this.get('fastboot.request.queryParams.noads');
			params.noexternals = this.get('fastboot.request.queryParams.noexternals');

			const url = getURL(params);

			return fetch(url)
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						return getFetchErrorMessage(response).then(() => {
							throw new WikiPageFetchError({
								code: response.status || 503
							}).withAdditionalData({
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
						this.get('simpleStore').setProperties({
							namespace: get(dataForShoebox, 'data.ns'),
							articleId: get(dataForShoebox, 'data.details.id'),
							isMainPage: get(dataForShoebox, 'data.isMainPage')
						});
					}

					return this.getModelForNamespace(data, params, contentNamespaces);
				})
				.catch((error) => {
					if (isFastBoot) {
						shoebox.put('wikiPageError', error);
						this.get('fastboot').set('response.statusCode', error.code || 503);
					}

					throw error;
				});
		} else {
			const wikiPageData = shoebox.retrieve('wikiPage'),
				wikiPageError = shoebox.retrieve('wikiPageError');

			// There is no way to remove stuff from shoebox, so ignore it on the consecutive page views
			if (wikiPageError && isInitialPageView) {
				throw wikiPageError;
			}

			if (get(wikiPageData, 'data.article')) {
				wikiPageData.data.article.content = document.querySelector('.article-content').innerHTML;
			}

			return this.getModelForNamespace(wikiPageData, params, contentNamespaces);
		}
	},

	/**
	 *
	 * @param {Object} data
	 * @param {Object} params
	 * @param {Array} contentNamespaces
	 * @returns {Object}
	 */
	getModelForNamespace(data, params, contentNamespaces) {
		const currentNamespace = data.data.ns,
			ownerInjection = getOwner(this).ownerInjection();
		let model;

		// Main pages can live in namespaces which are not marked as content
		if (isContentNamespace(currentNamespace, contentNamespaces) || data.data.isMainPage) {
			model = ArticleModel.create(ownerInjection, params);
			model.setData(data);

			return model;
		} else if (currentNamespace === MediawikiNamespace.CATEGORY) {
			model = CategoryModel.create(ownerInjection, params);
			model.setData(data);

			return model;
		} else if (currentNamespace === MediawikiNamespace.FILE) {
			model = FileModel.create(ownerInjection, params);
			model.setData(data);

			return model;
		} else if (
			currentNamespace === MediawikiNamespace.BLOG_ARTICLE &&
			// User blog listing has BLOG_ARTICLE namespace but no article
			data.data.article
		) {
			model = BlogModel.create(ownerInjection, params);
			model.setData(data);

			return model;
		} else {
			return EmberObject.create({
				redirectTo: data.data.redirectTo || null
			});
		}
	}
});
