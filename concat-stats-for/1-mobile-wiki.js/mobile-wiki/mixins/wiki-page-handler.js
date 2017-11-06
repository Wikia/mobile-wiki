define('mobile-wiki/mixins/wiki-page-handler', ['exports', 'mobile-wiki/models/wiki/article', 'mobile-wiki/models/wiki/blog', 'mobile-wiki/models/wiki/category', 'mobile-wiki/models/wiki/file', 'mobile-wiki/utils/mediawiki-namespace', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/errors', 'mobile-wiki/utils/extend', 'mobile-wiki/utils/url'], function (exports, _article, _blog, _category, _file, _mediawikiNamespace, _mediawikiFetch, _errors, _extend, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	var $ = Ember.$;
	var EmberObject = Ember.Object;
	var get = Ember.get;
	var getOwner = Ember.getOwner;


	/**
  *
  * @param {Object} params
  * @returns {string}
  */
	function getURL(params) {
		var query = {
			controller: 'MercuryApi',
			method: 'getPage',
			// We need to decode title because MW sends encoded content
			// It's only necessary in case of in-content links
			title: decodeURIComponent(params.title)
		};

		if (params.redirect) {
			query.redirect = params.redirect;
		}

		if (params.page) {
			query.categoryMembersPage = params.page;
		}

		return (0, _url.buildUrl)({
			host: params.host,
			path: '/wikia.php',
			query: query
		});
	}

	exports.default = Mixin.create({
		fastboot: service(),
		wikiVariables: service(),

		getPageModel: function getPageModel(params) {
			var _this = this;

			var isFastBoot = this.get('fastboot.isFastBoot'),
			    shoebox = this.get('fastboot.shoebox'),
			    contentNamespaces = this.get('wikiVariables.contentNamespaces'),
			    isInitialPageView = this.get('initialPageView').isInitialPageView();

			if (isFastBoot || !isInitialPageView) {
				var url = getURL(params);

				return (0, _mediawikiFetch.default)(url).then(function (response) {
					if (response.ok) {
						return response.json();
					} else {
						return (0, _errors.getFetchErrorMessage)(response).then(function (responseBody) {
							throw new _errors.WikiPageFetchError({
								code: response.status || 503
							}).withAdditionalData({
								responseBody: responseBody,
								requestUrl: url,
								responseUrl: response.url
							});
						});
					}
				}).then(function (data) {
					if (isFastBoot) {
						var dataForShoebox = (0, _extend.default)({}, data);

						if (dataForShoebox.data && dataForShoebox.data.article) {
							// Remove article content so it's not duplicated in shoebox and HTML
							delete dataForShoebox.data.article.content;
						}

						shoebox.put('wikiPage', dataForShoebox);
					}

					return _this.getModelForNamespace(data, params, contentNamespaces);
				}).catch(function (error) {
					if (isFastBoot) {
						shoebox.put('wikiPageError', error);
						_this.get('fastboot').set('response.statusCode', error.code || 503);
					}

					throw error;
				});
			} else {
				var wikiPageData = shoebox.retrieve('wikiPage'),
				    wikiPageError = shoebox.retrieve('wikiPageError');

				// There is no way to remove stuff from shoebox, so ignore it on the consecutive page views
				if (wikiPageError && isInitialPageView) {
					throw wikiPageError;
				}

				if (get(wikiPageData, 'data.article')) {
					wikiPageData.data.article.content = $('.article-content').html();
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
		getModelForNamespace: function getModelForNamespace(data, params, contentNamespaces) {
			var currentNamespace = data.data.ns,
			    ownerInjection = getOwner(this).ownerInjection();
			var model = void 0;

			// Main pages can live in namespaces which are not marked as content
			if ((0, _mediawikiNamespace.isContentNamespace)(currentNamespace, contentNamespaces) || data.data.isMainPage) {
				model = _article.default.create(ownerInjection, params);
				model.setData(data);

				return model;
			} else if (currentNamespace === _mediawikiNamespace.namespace.CATEGORY) {
				model = _category.default.create(ownerInjection, params);
				model.setData(data);

				return model;
			} else if (currentNamespace === _mediawikiNamespace.namespace.FILE) {
				model = _file.default.create(ownerInjection, params);
				model.setData(data);

				return model;
			} else if (currentNamespace === _mediawikiNamespace.namespace.BLOG_ARTICLE &&
			// User blog listing has BLOG_ARTICLE namespace but no article
			data.data.article) {
				model = _blog.default.create(ownerInjection, params);
				model.setData(data);

				return model;
			} else {
				return EmberObject.create({
					redirectTo: data.data.redirectTo || null
				});
			}
		}
	});
});