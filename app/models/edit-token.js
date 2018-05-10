import EmberObject, {get} from '@ember/object';
import {inject as service} from '@ember/service';
import fetch from '../utils/mediawiki-fetch';

export default EmberObject.extend({
	wikiUrls: service(),

	fetch(host, title) {
		return fetch(this.get('wikiUrls').build({
			host,
			path: '/api.php',
			query: {
				action: 'query',
				prop: 'info',
				titles: title,
				intoken: 'edit',
				format: 'json'
			}
		}))
			.then((response) => response.json())
			.then((resp) => {
				const pages = get(resp, 'query.pages');

				if (pages) {
					// FIXME: MediaWiki API, seriously?
					const edittoken = pages[Object.keys(pages)[0]].edittoken;

					if (typeof edittoken === 'undefined') {
						throw new Error('noedit');
					}

					return edittoken;
				} else {
					throw new Error();
				}
			});
	}
});
