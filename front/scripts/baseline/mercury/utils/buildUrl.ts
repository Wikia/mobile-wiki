/// <reference path='../../mercury.ts' />
/// <reference path="../../mercury.d.ts" />
interface UrlParams {
	namespace?: string;
	title?: string;
	path?: string;
	query?: any;
	wiki?: string;
}

module Mercury.Utils {
	/**
	 * This function constructs a URL given pieces of a typical Wikia URL. All URL
	 * parts are optional. Passing in empty params will result in the site home page,
	 * ie. www.wikia.com.
	 *
	 * Some example parameters and results:
	 *
	 *   {path: '/login', query: {redirect: '/somepage'}}
	 *   ...returns '//www.wikia.com/login?redirect=%2Fsomepage'
	 *
	 *   {wiki: 'glee', title: 'Jeff'}
	 *   ...returns '//glee.wikia.com/wiki/Jeff'
	 *
	 *   {wiki: 'community', namespace: 'User', title: 'JaneDoe', path: '/preferences'}
	 *   ...returns '//community.wikia.com/wiki/User:JaneDoe/preferences'
	 */
	export function buildUrl (urlParams: UrlParams = {}) {
		// Domain is extracted from basePath wiki variable, removing the *first* subdomain.

		var domain: string,
			url = '//';
		if (/wikia-dev\.\w{2,3}($|\/)/.test(Mercury.wiki.basePath)) {
			domain = Mercury.wiki.basePath.match(/(?!\w+)\.([\w.-]+\.\w{2,3})($|\/)/)[1];
		} else {
			domain = Mercury.wiki.basePath.match(/([\w-]+\.\w{2,3})($|\/)/)[1];
		}

		url += urlParams.wiki ? urlParams.wiki : 'www';
		url += '.' + domain;		

		if (urlParams.title) {
			url += '/wiki/' + (urlParams.namespace ? urlParams.namespace + ':' : '') + urlParams.title;
		}

		if (urlParams.path) {
			url += urlParams.path;
		}

		if (urlParams.query) {
			url += '?';
			url += Object.keys(urlParams.query).map((key: string) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(urlParams.query[key])}`
			).join('&');
		}

		return url; 
	}
}

