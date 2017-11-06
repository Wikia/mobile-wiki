define('mobile-wiki/models/wiki/article', ['exports', 'mobile-wiki/models/wiki/base', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _base, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var inject = Ember.inject;
	exports.default = _base.default.extend({
		wikiVariables: inject.service(),
		comments: 0,
		content: null,
		curatedMainPageData: null,
		featuredVideo: null,
		hasPortableInfobox: false,
		isCuratedMainPage: false,
		isMainPage: false,
		user: null,

		/**
   * @returns {Ember.RSVP.Promise}
   */
		getArticleRandomTitle: function getArticleRandomTitle() {
			return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
				host: this.get('wikiVariables.host'),
				path: '/api.php',
				query: {
					action: 'query',
					generator: 'random',
					grnnamespace: 0,
					format: 'json'
				}
			}), {
				cache: 'no-store'
			}).then(function (response) {
				return response.json();
			}).then(function (data) {
				if (data.query && data.query.pages) {
					var articleId = Object.keys(data.query.pages)[0],
					    pageData = data.query.pages[articleId];

					if (pageData.title) {
						return pageData.title;
					}
				}

				throw new Error({
					message: 'Data from server misshaped',
					data: data
				});
			});
		},


		/**
   * @param {Object} data
   * @returns {void}
   */
		setData: function setData(_ref) {
			var data = _ref.data;

			this._super.apply(this, arguments);

			var articleProperties = {},
			    details = void 0;

			if (data) {
				if (data.details) {
					details = data.details;

					articleProperties = {
						comments: details.comments,
						user: details.revision.user_id,
						details: details
					};
				}

				if (data.article) {
					articleProperties.content = data.article.content;

					if (data.article.featuredVideo) {
						articleProperties.featuredVideo = data.article.featuredVideo;
					}

					if (data.article.hasPortableInfobox) {
						articleProperties.hasPortableInfobox = data.article.hasPortableInfobox;
					}
				}

				if (data.relatedPages) {
					/**
      * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
      * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
      * to handle this and never return malformed structures.
      */
					articleProperties.relatedPages = data.relatedPages;
				}

				if (data.topContributors) {
					// Same issue: the response to the ajax should always be valid and not undefined
					articleProperties.topContributors = data.topContributors;
				}

				articleProperties.isMainPage = data.isMainPage || false;
				articleProperties.amphtml = data.amphtml;

				if (data.curatedMainPageData) {
					articleProperties.curatedMainPageData = data.curatedMainPageData;
					articleProperties.isCuratedMainPage = true;
				}
			}

			this.setProperties(articleProperties);
		}
	});
});