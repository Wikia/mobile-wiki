import { inject as service } from '@ember/service';
import BaseModel from './base';
import fetch from '../../utils/mediawiki-fetch';
import { namespace as mediawikiNamespace } from '../../utils/mediawiki-namespace';

export default BaseModel.extend({
	isRandomPage: true,
	ns: mediawikiNamespace.SPECIAL,
	wikiUrls: service(),
	wikiVariables: service(),

	/**
	 * @returns {RSVP.Promise}
	 */
	getArticleRandomTitle() {
		return fetch(this.wikiUrls.build({
			host: this.get('wikiVariables.host'),
			path: '/api.php',
			query: {
				action: 'query',
				generator: 'random',
				grnnamespace: 0,
				format: 'json',
			},
		}), {
			cache: 'no-store',
		})
			.then(response => response.json())
			.then((data) => {
				if (data.query && data.query.pages) {
					const articleId = Object.keys(data.query.pages)[0];
					const pageData = data.query.pages[articleId];

					if (pageData.title) {
						this.set('title', pageData.title);

						return this;
					}
				}

				throw new Error({
					message: 'Data from server misshaped',
					data,
				});
			});
	},
});
