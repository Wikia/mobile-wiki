import fetch from 'fetch';

export default function mediawikiFetch(url, options = {}) {
  if (typeof FastBoot !== 'undefined' && options.internalCache) {
    const Url = FastBoot.require('url');
    const proxyingAgent = FastBoot.require('proxying-agent');
    const parsedUrl = Url.parse(url);

    options.agent = proxyingAgent.create(`http://${options.internalCache}`, parsedUrl.host);
    options.follow = options.follow || 5;
  }

  return fetch(url, options);
}
