import fetch from 'fetch';
import config from '../config/environment';

export default function mediawikiFetch(url, options = {}) {
	if (typeof FastBoot !== 'undefined' && config.fastbootOnly.mediawikiDomain) {
		const Url = FastBoot.require('url');
		const proxyingAgent = FastBoot.require('proxying-agent');
		const parsedUrl = Url.parse(url);

		options.agent = proxyingAgent.create(`http://${config.fastbootOnly.mediawikiDomain}`, parsedUrl.host);
		options.follow = options.follow || 5;
	}

	return fetch(url, options);
}
