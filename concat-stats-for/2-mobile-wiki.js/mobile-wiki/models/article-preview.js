define('mobile-wiki/models/article-preview', ['exports', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberObject = Ember.Object,
	    inject = Ember.inject;
	exports.default = EmberObject.extend({
		wikiVariables: inject.service(),

		/**
   * prepare POST request body before sending to API
   * Encode all params to be able to retrieve correct
   * values from the text containing for example '&'
   *
   * @param {string} title title of edited article
   * @param {string} wikitext editor wikitext
   * @param {string} CKmarkup CK editor markup
   * @returns {Promise}
   */
		articleFromMarkup: function articleFromMarkup(title, wikitext, CKmarkup) {
			var url = (0, _url.buildUrl)({
				host: this.get('wikiVariables.host'),
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getArticleFromMarkup',
					title: title
				}
			}),
			    formData = new FastBoot.require('form-data')();

			if (wikitext) {
				formData.append('wikitext', wikitext);
			} else {
				formData.append('CKmarkup', CKmarkup);
			}

			return (0, _mediawikiFetch.default)(url, {
				method: 'POST',
				body: formData
			}).then(function (response) {
				return response.json();
			}).then(function (_ref) {
				var data = _ref.data;

				// Make sure media is in the same format as on article page
				// otherwise hero image won't work correctly
				data.article.media = {
					media: data.article.media
				};
				data.article.details = {
					ns: 0,
					title: title,
					revision: {},
					type: 'article',
					comments: 0
				};
				data.article.displayTitle = title;

				return data.article;
			});
		}
	});
});