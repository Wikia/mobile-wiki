import fetch from 'ember-network/fetch';
import config from '../config/environment';

export default function (url, options = {}) {
	if (typeof FastBoot !== 'undefined' && config.mediawikiDomain) {
		const Url = FastBoot.require('url'),
			parsedUrl = Url.parse(url);

		if (!options.headers) {
			options.headers = {};
		}

		options.headers.Host = parsedUrl.host;
		parsedUrl.host = config.mediawikiDomain;
		url = Url.format(parsedUrl);
	}

	return fetch(url, options);
}
