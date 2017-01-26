import * as MW from '../../lib/mediawiki';
import settings from '../../../config/settings';
import * as Utils from '../../lib/utils';

function getFullRequestUrl(request) {
	return `${request.connection.info.protocol}://${request.info.host}${request.url.path}`;
}

function getCommunityRedirectUrl(emailConfirmed, wikiDomain, username) {
	const path = username ? `wiki/User: ${username}` : 'wiki/Main_Page',
		wikiDomainSegments = wikiDomain.split('.');

	let communityNameIndex = 3;

	if (settings.environment === 'dev') {
		communityNameIndex = 4
	}

	wikiDomainSegments[wikiDomainSegments.length - communityNameIndex] = 'community';

	return `http://${wikiDomainSegments.join('.')}/${path}?emailConfirmed=${emailConfirmed}`;

}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	if (!request.auth.isAuthenticated) {
		return reply.redirect(
			`http://${request.info.hostname}/signin?redirect=${encodeURIComponent(getFullRequestUrl(request))}`
		);
	}
	const wikiDomain = Utils.getCachedWikiDomainName(settings, request);

	new MW.EmailConfirmationRequest({wikiDomain})
		.confirmEmail(request)
		.then((data) => {
			const username = JSON.parse(data.payload).username;

			return reply.redirect(getCommunityRedirectUrl(1, wikiDomain, username));
		})
		.catch(() => {
			return reply.redirect(getCommunityRedirectUrl(0, wikiDomain));
		});
}
