import {unauthorized} from 'boom';
import Wreck from 'wreck';
import settings from '../../config/settings';
import Logger from './logger';
import {getHeliosInternalUrl} from './auth-utils';
import uuid from 'uuid';

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
						Logger.error('Helios connection error: ', {
							err,
							parseError
						});
						return reply(unauthorized('Helios connection error'));
					}

					if (response.statusCode && response.statusCode !== 200) {
						if (response.statusCode === 401) {
							reply.unstate('access_token');
						}
						return reply(unauthorized('Token not authorized by Helios'));
					}
					return reply.continue({credentials: {userId: parsed.user_id}});
				};

			if (!accessToken) {
				return reply(unauthorized('No access_token'));
			}

			Wreck.get(
				getHeliosInternalUrl('/info', {
					code: accessToken
				}),
				{
					headers: {
						'X-Client-Ip': request.headers['fastly-client-ip'] || request.info.remoteAddress,
						'X-Forwarded-For': request.headers['x-forwarded-for'] || request.info.remoteAddress,
						'X-Trace-Id': request.headers['x-trace-id'] || uuid.v4()
					},
					timeout: settings.helios.timeout
				},
				callback
			);
		}
	};
}

