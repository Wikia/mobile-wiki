import {inject as service} from '@ember/service';
import EmberObject from '@ember/object';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

export default EmberObject.extend({
	wikiVariables: service(),

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
	articleFromMarkup(title, wikitext, CKmarkup) {
		const url = buildUrl({
				host: this.get('wikiVariables.host'),
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getArticleFromMarkup',
					title,
					simplifyRendering: 'true'
				}
			}),
			formData = new FastBoot.require('form-data')();

		if (wikitext) {
			formData.append('wikitext', wikitext);
		} else {
			formData.append('CKmarkup', CKmarkup);
		}

		return fetch(url, {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then(({data}) => {
				// Make sure media is in the same format as on article page
				// otherwise hero image won't work correctly
				data.article.media = {
					media: data.article.media
				};
				data.article.details = {
					ns: 0,
					title,
					revision: {},
					type: 'article',
					comments: 0
				};
				data.article.displayTitle = title;

				return data.article;
			});
	}
});
