import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import uuid from 'node-uuid';
import Wreck from 'wreck';
import translateUserIdFrom from './username';

function createValidateTokenContext(userInfo, request, token = '') {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo[0].userId}/validate_password_token`),
		options: {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'X-Client-Ip': request.headers['fastly-client-ip'] || request.info.remoteAddress,
				'X-Forwarded-For': request.headers['x-forwarded-for'] || request.info.remoteAddress,
				'X-Trace-Id': request.headers['x-trace-id'] || uuid.v4()
			},
			timeout: settings.helios.timeout,
			payload: `token=${token}`
		},
	};
}

function handleUserRegistrationResponse(data, request, token) {
	const userInfo = JSON.parse(data.payload),
		validateToken = createValidateTokenContext(userInfo, request, token);

	return new Promise((resolve, reject) => {
		Wreck.post(validateToken.url, validateToken.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({
					payload: new Buffer(payload).toString('utf8')
				});
			} else {
				Logger.error({
					url: validateToken.url
				},
				'Error while validating token.');

				reject({
					step: 'validate-token',
					error,
					response,
					payload
				});
			}
		});
	});
}

/**
 * @param {string} username
 * @param {string} token
 * @param {Object} request
 * @returns {Promise}
 */
export default function validateTokenFor(username, token, request) {
	return translateUserIdFrom(username, request)
		.then((data) => {
			return handleUserRegistrationResponse(data, request, token);
		});
}
