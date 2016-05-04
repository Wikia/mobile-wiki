import Ember from 'ember';
import request from 'ember-ajax/request';
/**
 * @param {string} title
 * @returns {Ember.RSVP.Promise}
 */
export default function (title) {
	return request(M.buildUrl({path: '/api.php'}), {
		data: {
			action: 'query',
			prop: 'info',
			titles: title,
			intoken: 'edit',
			format: 'json'
		}
	}).then((resp) => {
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
