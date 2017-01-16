import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import uuid from 'uuid';
import Wreck from 'wreck';
import translateUserIdFrom from './username';

function createUpdatePasswordContext(userInfo, request, password = '', token = '') {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo[0].userId}/password`),
		options: {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'X-Client-Ip': request.headers['fastly-client-ip'] || request.info.remoteAddress,
				'X-Forwarded-For': request.headers['x-forwarded-for'] || request.info.remoteAddress,
				'X-Trace-Id': request.headers['x-trace-id'] || uuid.v4()
			},
			timeout: settings.helios.timeout,
			payload: `password=${password}&token=${token}`
		},
	};
}

function handleUserRegistrationResponse(data, password, token, request) {
	const userInfo = JSON.parse(data.payload),
		updatePassword = createUpdatePasswordContext(userInfo, request, password, token);

	return new Promise((resolve, reject) => {
		Wreck.post(updatePassword.url, updatePassword.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({
					payload: new Buffer(payload).toString('utf8')
				});
			} else {
				Logger.error({
					url: updatePassword.url
				},
				'Error while resetting password.');

				reject({
					step: 'update-password',
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
 * @param {string} password
 * @param {string} token
 * @param {Object} request
 * @returns {Promise}
 */
export default function updatePasswordFor(username, password, token, request) {
	return translateUserIdFrom(username, request)
		.then(data => {
			return handleUserRegistrationResponse(data, password, token, request);
		});
}
