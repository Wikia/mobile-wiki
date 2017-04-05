import fetch from 'ember-network/fetch';
import config from '../config/environment';

export default function mediawikiFetch(url, options = {}) {
	if (typeof FastBoot !== 'undefined' && config.mediawikiDomain) {
		const Url = FastBoot.require('url'),
			parsedUrl = Url.parse(url);

		if (!options.headers) {
			options.headers = {};
		}

		options.follow = options.follow || 5;
		options.counter = options.counter || 0;
		options.redirect = 'manual';
		options.headers.Host = parsedUrl.host;
		parsedUrl.host = config.mediawikiDomain;
		url = Url.format(parsedUrl);
	}

	return fetch(url, options).then((response) => {
		if (response.status >= 301 && response.status <= 308) {
			if (options.counter < options.follow) {
				options.counter++;
				return mediawikiFetch(response.headers.get('Location'), options);
			} else {
				throw new Error(`maximum redirect reached at: ${response.headers.get('Location')}`);
			}
		}

		return response;
	});
}
