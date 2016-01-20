import {unauthorized} from 'boom';
import Wreck from 'wreck';
import localSettings from '../../config/localSettings';
import Logger from './Logger';
import {getWhoAmIUrl} from './AuthUtils';

/**
 * @returns {Object}
 */
export default function scheme() {
	return {
		/**
		 * @param {*} request
		 * @param {*} reply
		 * @returns {*}
		 */
		authenticate: (request, reply) => {
			const accessToken = request.state.access_token,
				/**
				 * @param {*} err
				 * @param {*} response
				 * @param {string} payload
				 * @returns {*}
				 */
				callback = (err, response, payload) => {
					let parsed,
						parseError;

					try {
						parsed = JSON.parse(payload);
					} catch (e) {
						parseError = e;
					}

					// Detects an error with the connection
					if (err || parseError) {
						Logger.error('WhoAmI connection error: ', {
							err,
							parseError
						});
						return reply(unauthorized('WhoAmI connection error'));
					}

					if (parsed.status && parsed.status !== 200) {
						if (parsed.status === 401) {
							reply.unstate('access_token');
						}
						return reply(unauthorized('Token not authorized by WhoAmI'));
					}
					return reply.continue({credentials: {userId: parsed.userId}});
				};

			if (!accessToken) {
				return reply(unauthorized('No access_token'));
			}

			Wreck.get(
				getWhoAmIUrl(),
				{
					timeout: localSettings.whoAmIService.timeout,
					headers: {
						Cookie: `access_token=${encodeURIComponent(accessToken)}`
					}
				},
				callback
			);
		}
	};
}

