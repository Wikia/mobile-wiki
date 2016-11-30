// TODO: On the plugin level: know whether the requested page is a main page
// TODO: On the plugin level: if prerender response is not 200, fall back to rendering the page in a normal way

import settings from '../../config/settings';

const urlsToPrerenderRegExp = new RegExp([
	'^bleach\.[^/]+/wiki/Bleach_Wiki',
	'^bleach\.[^/]+/main/',
	'^dc\.[^/]+/wiki/DC_Comics_Database',
	'^dc\.[^/]+/main/',
	'^onepiece\.[^/]+/wiki/Main_Page',
	'^onepiece\.[^/]+/main/',
].join('|'));

function canPrerender(req) {
	const host = req.headers.host.toLowerCase(),
		path = req.url.pathname,
		isGet = req.method.toLowerCase() === 'get',
		url = host + path,
		urlMatches = url.match(urlsToPrerenderRegExp);

	return !!(urlMatches && isGet && settings.prerender.token);
}

function shouldPrerender(req) {
	return req.url.query._escaped_fragment_ !== undefined && canPrerender(req);
}

function updateRequestedUrl(url) {
	// Direct prerender.io to production if initiated from dev or sandbox environments
	let useskin = '';
	if (url.search('[?&]useskin=mercury') === -1) {
		useskin = `${url.indexOf('?') > -1 ? '&' : '?'}useskin=mercury`;
	}
	url = url.replace('.127.0.0.1.xip.io:7000/', '.wikia.com/');
	url = url.replace(new RegExp('\.[a-z]+\.wikia-dev\.com/'), '.wikia.com/');
	url = url.replace(new RegExp('^http://sandbox-[^.]+.'), 'http://');

	return `${url}${useskin}`;
}

module.exports = {
	canPrerender,
	prerenderOptions: {
		shouldPrerender,
		updateRequestedUrl,
		token: settings.prerender.token
	},
	prerenderPlugin: require('hapi-prerender')
};
