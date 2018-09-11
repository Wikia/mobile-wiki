import fetch from 'fetch';
import config from '../config/environment';

export default function mediawikiFetch(url, options = {}) {
  if (typeof FastBoot !== 'undefined') {
    const headers = options.headers || {};

    headers['X-Wikia-Internal-Request'] = config.appName;
    options.headers = headers;

    if (options.internalCache) {
      const Url = FastBoot.require('url');
      const proxyingAgent = FastBoot.require('proxying-agent');
      const parsedUrl = Url.parse(url);

      options.agent = proxyingAgent.create(`http://${options.internalCache}`, parsedUrl.host);
      options.follow = options.follow || 5;
    }
  }

  return fetch(url, options);
}
