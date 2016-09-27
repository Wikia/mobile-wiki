// TODO: On the plugin level: know whether the requested page is a main page
// TODO: On the plugin level: if prerender response is not 200, fall back to rendering the page in a normal way

import localSettings from '../../config/localSettings';

const botUserAgentsRegExp = new RegExp([
		// google, yahoo, bing
		// understand the _escaped_fragment_ mechanism so we detect them by it
		'baiduspider',
		'facebookexternalhit',
		'twitterbot',
		'rogerbot',
		'linkedinbot',
		'embedly',
		'quora link preview',
		'showyoubot',
		'outbrain',
		'pinterest',
		'developers.google.com/\+/web/snippet'
	].join('|'), 'i'),
	urlsToPrerenderRegExp = new RegExp([
		'^bleach\.[^/]*/wiki/Bleach_Wiki',
		'^bleach\.[^/]*/main/',
		'^dc\.[^/]*/wiki/DC_Comics_Database',
		'^dc\.[^/]*/main/',
		'^onepiece\.[^/]*/wiki/Main_Page',
		'^onepiece\.[^/]*/main/',
	].join('|'));

function canPrerender(req) {
	const host = req.headers.host.toLowerCase(),
		path = req.url.pathname,
		isGet = req.method.toLowerCase() === 'get',
		url = host + path,
		urlMatches = url.match(urlsToPrerenderRegExp);

	return !!(urlMatches && isGet && localSettings.prerender.token);
}

function shouldPrerender(req) {
	const userAgent = req.headers['user-agent'] || '',
		bufferAgent = req.headers['x-bufferbot'] || '',
		requestingEscapedFragment = (req.url.query._escaped_fragment_ !== undefined),
		knownBot = (userAgent.search(botUserAgentsRegExp) !== -1);

	if (!requestingEscapedFragment && !knownBot && !bufferAgent) {
		return false;
	}

	return canPrerender(req);
}

function updateRequestedUrl(url) {
	// Direct prerender.io to production if initiated from dev or sandbox environments
	url = url.replace('.127.0.0.1.xip.io:7000/', '.wikia.com/');
	url = url.replace(new RegExp('\.[a-z]*\.wikia-dev\.com\/'), 'wikia.com/');
	url = url.replace(new RegExp('^http://sandbox-[^.]*.'), 'http://');
	return `${url}?useskin=mercury`;
}

module.exports = {
	canPrerender,
	prerenderOptions: {
		shouldPrerender,
		updateRequestedUrl,
		token: localSettings.prerender.token
	},
	prerenderPlugin: require('hapi-prerender')
};
