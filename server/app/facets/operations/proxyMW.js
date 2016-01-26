import {createUrl} from '../../lib/MediaWiki';
import localSettings from '../../../config/localSettings';
import {getCachedWikiDomainName} from '../../lib/Utils';

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function proxyMW(request, reply) {
	const path = request.path.substr(1),
		url = createUrl(getCachedWikiDomainName(localSettings, request), path);

	reply.proxy({
		uri: url,
		redirects: localSettings.proxyMaxRedirects
	});
}
