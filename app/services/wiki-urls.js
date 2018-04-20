import Service, {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {getQueryString} from '../utils/url';

export default Service.extend({
	fastboot: service(),
	wikiVariables: service(),

	langPath: computed(function () {
		return this.getLanguageCodeFromRequest(this.get('fastboot.request.path') || window.location.pathname);
	}),

	langPathRegexp: '(/[a-z]{2,3}(?:-[a-z-]{2,12})?)',

	getLanguageCodeFromRequest(path) {
		const matches = path.match(new RegExp(`^${this.get('langPathRegexp')}/`));

		return matches && matches[1] || '';
	},

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
		const host = urlParams.host;
		const langPath = this.get('langPath');
		const currentHost = this.get('wikiVariables.host');

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

		if (host === currentHost && langPath) {
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
	},

	/**
	 * @typedef {Object} LinkInfo
	 * @property {string|null} article
	 * @property {string|null} url
	 * @property {string|null} [hash]
	 */

	/**
	 * Parse links in an article and return information about how to process a given link.
	 * Only one of article or url will be non-null. If article is
	 * non-null, then the application should transition to that article. If url is non-null, then the application should
	 * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
	 *
	 * @param {string} currentTitle - the title of the current article, such as David_Michael_Vigil
	 * @param {string} hash - jumplink, either '#something' (to indicate there is a jumplink) or '' or undefined
	 * @param {string} uri - the absolute link
	 * @param {string} queryString - the query string
	 *
	 * @returns {LinkInfo}
	 */
	getLinkInfo(currentTitle, hash, uri, queryString) {
		const basePath = this.get('wikiVariables.basePath');
		const localPathMatch = uri.match(`^${basePath}(?:${this.get('langPath')})(.*)$`);

		// We treat local URLs with query params that aren't handled elsewhere
		// as external links rather than as articles
		if (localPathMatch && !queryString) {
			const local = localPathMatch[1];

			/**
			 * Here we test if its an article link. We also have to check for /wiki/something for the jump links,
			 * because the url will be in that form and there will be a hash
			 *
			 * @todo We currently don't handle links to other pages with jump links appended. If input is a
			 * link to another page, we'll simply transition to the top of that page regardless of whether or not
			 * there is a #jumplink appended to it.
			 *
			 * Example match array for /wiki/Kermit_the_Frog#Kermit_on_Sesame_Street
			 *     0: "/wiki/Kermit_the_Frog#Kermit on Sesame Street"
			 *     1: "Kermit_the_Frog"
			 *     2: "#Kermit_on_Sesame_Street"
			 */
			const article = local.match(new RegExp(`^(?:/wiki)/([^#]+)(#.*)?$`));

			let comparison;

			if (article) {
				try {
					comparison = decodeURIComponent(article[1]);
				} catch (e) {
					comparison = article[1];
				}

				if (comparison === currentTitle && hash) {
					return {
						article: null,
						url: hash
					};
				}

				return {
					article: article[1],
					url: null,
					hash: article[2] ? hash : null
				};
			}
		}

		return {
			article: null,
			url: uri
		};
	}
});
