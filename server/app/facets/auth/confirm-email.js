import * as MW from '../../lib/mediawiki';
import settings from '../../../config/settings';
import * as Utils from '../../lib/utils';
import {getUserId} from '../operations/page-data-helper';

function getFullRequestUrl(request) {
	return `${request.connection.info.protocol}://${request.info.host}${request.url.path}`;
}

function getCommunityRedirectUrl(emailConfirmed, username) {
	const url = Utils.getWikiBaseUrlFromWikiDomain(settings, '', 'community'),
		path = username ? `wiki/User: ${username}` : 'wiki/Main_Page';

	return `http://${url}/${path}?emailConfirmed=${emailConfirmed}`;

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

			return reply.redirect(getCommunityRedirectUrl(1, username));
		})
		.catch(() => {
			return reply.redirect(getCommunityRedirectUrl(0));
		});
}
