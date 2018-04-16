import Service, {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {getQueryString} from '../utils/url';
import getLanguageCodeFromRequest from '../utils/language';

export default Service.extend({
	fastboot: service(),

	langPath: computed('fastboot.request', function () {
		return getLanguageCodeFromRequest(this.get('fastboot.request') || window.location.pathname);
	}),

	/**
	 * This function constructs a URL given pieces of a typical Wikia URL. All URL
	 * parts are optional. Passing in empty params will output the root index URL
	 * of the current host.
	 *
	 * Some example parameters and results:
	 *
	 *   {host: 'glee.wikia.com', path: '/login', query: {redirect: '/somepage'}}
	 *   ...returns 'http://www.wikia.com/login?redirect=%2Fsomepage'
	 *
	 *   {host: 'glee.wikia.com', title: 'Jeff'}
	 *   ...returns 'http://glee.wikia.com/wiki/Jeff'
	 *
	 *   {host: 'glee.wikia.com', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
	 *   ...returns 'http://glee.wikia.com/wiki/User:JaneDoe/preferences'
	 *
	 * @param {Object} urlParams
	 * @returns {string}
	 */
	build(urlParams) {
		const host = urlParams.host,
			langPath = this.get('langPath');

		if (!urlParams.protocol) {
			if (window && window.location && window.location.protocol) {
				urlParams.protocol = window.location.protocol.replace(':', '');
			} else {
				urlParams.protocol = 'http';
			}
		}

		if (!urlParams.articlePath) {
			urlParams.articlePath = '/wiki/';
		}

		let url = '';

		if (!urlParams.relative) {
			url += `${urlParams.protocol}://${host}`;
		}

		if (langPath) {
			url += langPath;
		}

		if (urlParams.title) {
			url += urlParams.articlePath +
				(urlParams.namespace ? `${urlParams.namespace}:` : '') +
				encodeURIComponent(urlParams.title);
		}

		if (urlParams.wikiPage) {
			url += urlParams.articlePath + urlParams.wikiPage;
		}

		if (urlParams.path) {
			url += urlParams.path;
		}

		if (urlParams.query) {
			url += getQueryString(urlParams.query);
		}

		return url;
	}
});
