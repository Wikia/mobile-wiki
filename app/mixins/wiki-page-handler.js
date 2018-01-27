import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import $ from 'jquery';
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
import {Promise} from 'rsvp';
import {run} from '@ember/runloop';
import {A} from '@ember/array';

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

	getPageModel(params) {
		const isFastBoot = this.get('fastboot.isFastBoot'),
			shoebox = this.get('fastboot.shoebox'),
			contentNamespaces = this.get('wikiVariables.contentNamespaces'),
			isInitialPageView = this.get('initialPageView').isInitialPageView();

		if (isFastBoot) {
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
		} else if (!isInitialPageView) {
			params.noads = this.get('fastboot.request.queryParams.noads');
			params.noexternals = this.get('fastboot.request.queryParams.noexternals');
			params.mcache = 'writeonly';

			const url = getURL(params);

			/* eslint no-undef:0 */
			return new Promise((resolve, reject) => {
				let model;
				console.time('start')
				console.time('shouldRender')
				console.time('ads')

				if (params.title.indexOf(':') === -1) {
					model = this.getModelForNamespace({
						data: {
							ns: 0
						}
					}, params, contentNamespaces, true);
					model.ns = 0;
					model.content = A([]);
					model.htmlTitle = params.title.replace(/_/ig, ' ');
					model.displayTitle = params.title.replace(/_/ig, ' ');
					model.isLoading = true;

					const a = setInterval(() => {
						if (window.scrollY < 10) {
							resolve(model);
							clearInterval(a);
						}
					}, 100);

				}

				console.timeEnd('shouldRender');


				const request = oboe(url);

				if (!model) {
					request.node('data.ns', (ns) => {

						model = this.getModelForNamespace({
							data: {
								ns
							}
						}, params, contentNamespaces, true);

						model.htmlTitle = params.title.replace(/_/ig, ' ');
						model.displayTitle = params.title.replace(/_/ig, ' ');
						model.content = A([]);
						model.ns = ns;
						model.isLoading = true;

						resolve(model);
					});
				}

				let first = true;

				request.node('data.details', (details) => {
					model.set('comments', details.comments);
					model.set('user', details.revision.user_id);
					model.set('details', details);

					// Display title is used in header
					model.set('displayTitle', details.title);

				})
					.node('data.adsContext', (adsContext) => {
						model.set('adsContext', adsContext);

						if (model.get('adsContext.targeting')) {
							model.set('adsContext.targeting.mercuryPageCategories', model.get('categories'));
						}
					})
					.node('data.article.content.*', function (paragraph) {
						model.get('content').pushObject(paragraph);
						this.forget();
					})
					.node('data.article.content', (content) => {
						setTimeout(() => {
							model.set('content', content);
						}, 500);
					})
					.node('data.article', (article) => {
						if (article.featuredVideo) {
							model.set('featuredVideo', article.featuredVideo);
						}

						if (article.hasPortableInfobox) {
							model.set('hasPortableInfobox', article.hasPortableInfobox);
						}
					})
					.done(() => {
						console.timeEnd('start')
						model.set('isLoading', false);
					})
					.fail((error) => {
						// reject(error);
					});
			});
		} else {
			const wikiPageData = shoebox.retrieve('wikiPage'),
				wikiPageError = shoebox.retrieve('wikiPageError');

			// There is no way to remove stuff from shoebox, so ignore it on the consecutive page views
			if (wikiPageError && isInitialPageView) {
				throw wikiPageError;
			}

			if (get(wikiPageData, 'data.article')) {
				wikiPageData.data.article.html = $('.article-content').html();
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
	getModelForNamespace(data, params, contentNamespaces, notset) {
		const currentNamespace = data.data.ns,
			ownerInjection = getOwner(this).ownerInjection();
		let model;

		// Main pages can live in namespaces which are not marked as content
		if (isContentNamespace(currentNamespace, contentNamespaces) || data.data.isMainPage) {
			model = ArticleModel.create(ownerInjection, params);
			if (!notset) {
				model.setData(data);
			}


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
