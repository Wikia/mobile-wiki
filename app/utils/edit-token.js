import Ember from 'ember';
import fetch from './mediawiki-fetch';
import {buildUrl} from '../utils/url';
/**
 * @param {string} host
 * @param {string} title
 * @returns {Ember.RSVP.Promise}
 */
export default function (host, title) {
	return fetch(buildUrl({
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
			const pages = Ember.get(resp, 'query.pages');

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
