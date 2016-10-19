/**
 * @typedef {Object} MercuryUtilsBuildUrlParams
 * @property {string} [namespace] - MediaWiki article namespace
 * @property {string} [path] - Additional URL path appended to the end of the URL before the querystring
 * @property {string} [protocol] - Protocol
 * @property {Object} [query] - Querystring data, which is converted to a string and properly escaped
 * @property {string} [title] - Article title - value of the parameter will be encoded
 * @property {string} [wiki] - Wiki name, as it would be used as a subdomain
 * @property {string} [wikiPage] - Page inside /wiki/ directory - not necessarily an article
 */

if (typeof window.M === 'undefined') {
	window.M = {};
}

(function (M) {
	/**
	 * Converting and escaping Querystring object to string.
	 *
	 * @param {Object} [query={}] Querystring object
	 * @returns {string}
	 */
	function getQueryString(query = {}) {
		const queryArray = Object.keys(query);

		let queryString = '';

		if (queryArray.length > 0) {
			/**
			 * @param {string} key
			 * @returns {string}
			 */
			queryString = `?${queryArray.map((key) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
			).join('&')}`;
		}

		return queryString;
	}

	/**
	 * Substitutes the wiki name in a host string with a new wiki name
	 *
	 * @param {string} host - A host string (may include port number) from any Wikia environment
	 * @param {string} wiki - The new wiki, which may contain a language prefix; for example, "glee" or "es.walkingdead"
	 * @returns {string} New host
	 */
	M.replaceWikiInHost = function (host, wiki) {
		let match;

		if ((match = host.match(/^(sandbox-.+?|preview|verify)\.(.+?)\.wikia\.com($|\/|:)/)) !== null) {
			// (1) Sandbox, preview, or verify hosts on wikia.com
			host = host.replace(`${match[1]}.${match[2]}`, `${match[1]}.${wiki}`);
		} else if ((match = host.match(/^(.+?)\.wikia\.com($|\/|:)/)) !== null) {
			// (2) Production wikia.com
			// Domain is specified here in case subdomain is actually "wiki", "com", etc.
			host = host.replace(`${match[1]}.wikia.com`, `${wiki}.wikia.com`);
		} else if ((match = host.match(/^(.+)\.(.+?)\.wikia-dev.\w{2,3}($|\/|:)/)) !== null) {
			// (3) Devbox hosted on wikia-dev.com, wikia-dev.us, wikia-dev.pl, etc.
			host = host.replace(`${match[1]}.${match[2]}`, `${wiki}.${match[2]}`);
		} else if ((match = host.match(/^(.+)\.(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\.xip\.io($|\/|:)/)) !== null) {
			// (4) Environment using xip.io
			host = host.replace(`${match[1]}.${match[2]}.xip.io`, `${wiki}.${match[2]}.xip.io`);
		}

		// At this point, in the case of an unknown local host where the wiki is not in the
		// host string (ie. "mercury:8000"), it will be left unmodified and returned as-is.
		return host;
	};

	/**
	 * This function constructs a URL given pieces of a typical Wikia URL. All URL
	 * parts are optional. Passing in empty params will output the root index URL
	 * of the current host.
	 *
	 * Some example parameters and results:
	 *
	 *   {wiki: 'www', path: '/login', query: {redirect: '/somepage'}}
	 *   ...returns 'http://www.wikia.com/login?redirect=%2Fsomepage'
	 *
	 *   {wiki: 'glee', title: 'Jeff'}
	 *   ...returns 'http://glee.wikia.com/wiki/Jeff'
	 *
	 *   {wiki: 'community', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
	 *   ...returns 'http://community.wikia.com/wiki/User:JaneDoe/preferences'
	 *
	 * @param {MercuryUtilsBuildUrlParams} urlParams
	 * @param {Object} [context=window] - Window context
	 * @returns {string}
	 */
	M.buildUrl = function (urlParams = {}, context = window) {
		const mediawikiDomain = M.prop('mediawikiDomain'),
			host = context.location.host;

		if (!urlParams.protocol) {
			urlParams.protocol = 'http';
		}

		let url = `${urlParams.protocol}://`;

		if (urlParams.wiki) {
			url += M.replaceWikiInHost(host, urlParams.wiki);
		} else if (typeof mediawikiDomain !== 'undefined') {
			url += mediawikiDomain;
		} else {
			url += host;
		}

		if (urlParams.title) {
			url += Mercury.wiki.articlePath +
				(urlParams.namespace ? `${urlParams.namespace}:` : '') +
				encodeURIComponent(urlParams.title);
		}

		if (urlParams.wikiPage) {
			url += Mercury.wiki.articlePath + urlParams.wikiPage;
		}

		if (urlParams.path) {
			url += urlParams.path;
		}

		if (urlParams.query) {
			url += getQueryString(urlParams.query);
		}

		return url;
	};

	/**
	 * @param {string} [path='']
	 * @returns {string}
	 */
	M.getDiscussionServiceUrl = function (path = '') {
		return `https://${M.prop('servicesDomain')}/${M.prop('discussionBaseRoute')}${path}`;
	};

	/**
	 * @param {string} [path='']
	 * @returns {string}
	 */
	M.getFollowingServiceUrl = function (path = '') {
		return `https://${M.prop('servicesDomain')}/${M.prop('followingBaseRoute')}${path}`;
	},

	/**
	 * @param {string} [path='']
	 * @returns {string}
	 */
	M.getOpenGraphServiceUrl = function (path = '') {
		return `https://${M.prop('servicesDomain')}/${M.prop('openGraphBaseRoute')}${path}`;
	};

	/**
	 * @param {string} [path='']
	 * @returns {string}
	 */
	M.getAttributeServiceUrl = function (path = '') {
		return `https://${M.prop('servicesDomain')}/${M.prop('siteAttributeBaseRoute')}${path}`;
	};

	/**
	 * @param {string} [path='']
	 * @param {Object} [query={}]
	 * @returns {string}
	 */
	M.getImageReviewServiceUrl = function (path = '', query = {}) {
		return `https://${M.prop('servicesDomain')}/${M.prop('imageReviewBaseRoute')}${path}${getQueryString(query)}`;
	};

	/**
	 * @param {string} [path='']
	 * @param {Object} [query={}]
	 * @returns {string}
	 */
	M.getStaticAssetsServiceUrl = function (path = '', query = {}) {
		return `https://${M.prop('servicesDomain')}/${M.prop('staticAssetsBaseRoute')}${path}${getQueryString(query)}`;
	};

	/**
	 * @param {string} [path='']
	 * @returns {string}
	 */
	M.getUserPermissionsServiceUrl = function (path = '') {
		return `https://${M.prop('servicesDomain')}/${M.prop('userPermissionsBaseRoute')}${path}`;
	};
})(M);
