import * as authUtils from '../../lib/auth-utils';
import Wreck from 'wreck';
import Logger from '../../lib/logger';

/**
 *
 * @param {Hapi.Request} request
 * @param {function} invalidateTokenCallback
 */
function invalidateAccessToken(request, invalidateTokenCallback) {
	const accessToken = request.state.access_token,
		userId = request.auth.credentials.userId,
		invalidateTokenUrl = authUtils.getHeliosInternalUrl(`/token/${accessToken}`);

	if (accessToken) {
		Wreck.delete(invalidateTokenUrl, {headers: {'X-Wikia-UserId': userId}}, invalidateTokenCallback);
	}

}

function getMWTimestamp() {
	const now = new Date(),
		year = now.getFullYear().toString(),
		month = now.getMonth() < 9 ? `0${now.getMonth() + 1}` : (now.getMonth() + 1).toString(),
		date = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate().toString(),
		hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours().toString(),
		minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes().toString(),
		seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds().toString();

	return year + month + date + hours + minutes + seconds;
}


/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function logout(request, reply) {
	const invalidateTokenCallback = (err) => {
		if (err) {
			Logger.error('Invalidate token error');
		}

		reply.unstate('access_token');
		reply.unstate('wikicities_session');
		reply.unstate('wikicitiesUserId');
		reply.unstate('UserName');
		reply.unstate('Token');

		reply.state('wikicitiesLoggedOut', getMWTimestamp(), {
			ttl: 86400 * 1000
		});

		reply.redirect(request.headers.referer);
	};
	invalidateAccessToken(request, invalidateTokenCallback);
}
