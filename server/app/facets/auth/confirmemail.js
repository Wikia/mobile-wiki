import * as MW from '../../lib/mediawiki';
import settings from '../../../config/settings';
import * as Utils from '../../lib/utils';


/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	if (!request.auth.isAuthenticated) {
		return reply.redirect(`${request.info.hostname}/signin?redirect=${request.url.format()}`);
	}
	const wikiDomain = Utils.getCachedWikiDomainName(settings, request);

	new MW.EmailConfirmationRequest({wikiDomain})
		.confirmEmail(request.query.token)
		.then(function () {
			return reply.redirect('http://community.bkowalczyk.wikia-dev.com/wiki/Main_Page?emailConfirmed=1');
		})
		.catch(function () {
			return reply.redirect('http://community.bkowalczyk.wikia-dev.com/wiki/Main_Page?emailConfirmed=0');
		});
}
