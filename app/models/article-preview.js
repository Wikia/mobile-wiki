import Ember from 'ember';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const {Object: EmberObject} = Ember;

export default EmberObject.extend({
	host: null,

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
				host: this.get('host'),
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getArticleFromMarkup',
					title
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

				return data.article
			});
	}
});
