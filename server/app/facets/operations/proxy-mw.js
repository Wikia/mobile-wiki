import {createUrl} from '../../lib/mediawiki';
import settings from '../../../config/settings';
import {getCachedWikiDomainName} from '../../lib/utils';

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function proxyMW(request, reply) {
	const path = request.path.substr(1),
		url = createUrl(getCachedWikiDomainName(settings, request), path);

	reply.proxy({
		uri: url,
		redirects: settings.proxyMaxRedirects
	});
}
