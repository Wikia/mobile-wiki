import {unauthorized} from 'boom';
import Wreck from 'wreck';
import settings from '../../config/settings';
import Logger from './logger';
import {getHeliosInternalUrl} from './auth-utils';
import {getInternalHeaders} from '../lib/utils';

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
		authenticate(request, reply) {
			const accessToken = request.state.access_token,
				/**
				 * @param {*} error
				 * @param {*} response
				 * @param {string} payload
				 * @returns {*}
				 */
				callback = (error, response, payload) => {
					let parsed;

					// Detects an error with the connection
					if (error) {
						Logger.error('Helios connection error: ', error);

						return reply(unauthorized('Helios connection error'));
					}

					try {
						parsed = JSON.parse(payload);
					} catch (parseError) {
						Logger.error('Helios payload error: ', parseError);

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
					headers: getInternalHeaders(request),
					timeout: settings.helios.timeout
				},
				callback
			);
		}
	};
}
