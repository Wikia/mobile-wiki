define('mobile-wiki/models/wiki/base', ['exports', 'mobile-wiki/models/media', 'mobile-wiki/utils/extend'], function (exports, _media, _extend) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	/**
  * get type for open graph, website is for main page even if API returns 'article'
  *
  * @param {bool} isMainPage
  * @param {string} type
  * @returns string
  */
	function getType(_ref) {
		var isMainPage = _ref.isMainPage,
		    type = _ref.details.type;

		if (isMainPage) {
			return 'website';
		} else {
			return type;
		}
	}

	var EmberObject = Ember.Object,
	    get = Ember.get,
	    getOwner = Ember.getOwner;
	exports.default = EmberObject.extend({
		adsContext: null,
		basePath: null,
		categories: [],
		description: '',
		displayTitle: null,
		htmlTitle: '',
		id: null,
		media: [],
		mediaUsers: [],
		ns: null,
		redirectEmptyTarget: false,
		title: null,
		url: null,
		user: null,
		wiki: null,

		/**
   * @param {Object} data
   * @returns {void}
   */
		setData: function setData(_ref2) {
			var data = _ref2.data;

			var pageProperties = void 0,
			    article = void 0;

			if (data) {
				// This data should always be set
				pageProperties = {
					articleType: get(data, 'articleType'),
					categories: get(data, 'categories'),
					description: get(data, 'details.description'),
					hasArticle: get(data, 'article.content.length') > 0,
					htmlTitle: get(data, 'htmlTitle'),
					id: get(data, 'details.id'),
					ns: get(data, 'ns'),
					title: get(data, 'details.title'),
					url: get(data, 'details.url'),
					type: getType(data)
				};

				// Article related Data - if Article exists
				if (data.article) {
					article = data.article;

					(0, _extend.default)(pageProperties, {
						displayTitle: get(data, 'article.displayTitle'),
						user: get(data, 'details.revision.user_id')
					});

					if (article.content && article.content.length > 0) {
						(0, _extend.default)(pageProperties, {
							content: article.content,
							mediaUsers: article.users,
							redirectEmptyTarget: data.redirectEmptyTarget
						});
						pageProperties.media = _media.default.create(getOwner(this).ownerInjection(), {
							media: article.media
						});
					}
				}

				if (data.adsContext) {
					pageProperties.adsContext = data.adsContext;

					if (pageProperties.adsContext.targeting) {
						pageProperties.adsContext.targeting.mercuryPageCategories = pageProperties.categories;
					}
				}

				// Display title is used in header
				pageProperties.displayTitle = pageProperties.displayTitle || pageProperties.title;
			}

			this.setProperties(pageProperties);
		}
	});
});