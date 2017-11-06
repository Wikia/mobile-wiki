define('mobile-wiki/models/wiki/category', ['exports', 'mobile-wiki/models/wiki/base', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _base, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var isEmpty = Ember.isEmpty;
	exports.default = _base.default.extend({
		host: null,
		hasArticle: false,
		membersGrouped: null,
		nextPage: null,
		pages: null,
		prevPage: null,
		trendingArticles: null,

		/**
   * @param {number} page
   * @returns {Ember.RSVP.Promise}
   */
		loadPage: function loadPage(page) {
			var _this = this;

			return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
				host: this.get('host'),
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getCategoryMembers',
					title: this.get('title'),
					categoryMembersPage: page,
					format: 'json'
				}
			})).then(function (response) {
				return response.json();
			}).then(function (_ref) {
				var data = _ref.data;

				if (isEmpty(data) || isEmpty(data.membersGrouped)) {
					throw new Error('Unexpected response from server');
				}

				_this.setProperties(data);
			});
		},


		/**
   * @param {Object} data
   * @returns {void}
   */
		setData: function setData(_ref2) {
			var data = _ref2.data;

			this._super.apply(this, arguments);

			if (data && data.nsSpecificContent) {
				this.setProperties(data.nsSpecificContent);
			}
		}
	});
});