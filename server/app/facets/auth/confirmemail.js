import * as MW from '../../lib/mediawiki';
import settings from '../../../config/settings';
import * as Utils from '../../lib/utils';
import {getUserId} from '../operations/page-data-helper';

function getFullRequestUrl(request) {
	return request.connection.info.protocol
		+ '://'
		+ request.info.host
		+ request.url.path;
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function get(request, reply) {
	if (!request.auth.isAuthenticated) {
		return reply.redirect(`http://${request.info.hostname}/signin?redirect=${getFullRequestUrl(request)}`);
	}
	const wikiDomain = Utils.getCachedWikiDomainName(settings, request),
		userId = getUserId(request);

	new MW.UserInfoRequest()
		.getUserInfo(userId)
		.then()

	new MW.EmailConfirmationRequest({wikiDomain})
		.confirmEmail(request.query.token)
		.then(function () {
			return reply.redirect('http://community.bkowalczyk.wikia-dev.com/wiki/Main_Page');
		})
		.catch(function () {
			return reply.redirect('http://community.bkowalczyk.wikia-dev.com/wiki/Main_Page');
		});
}
