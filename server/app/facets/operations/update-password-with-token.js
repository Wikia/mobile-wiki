import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';
import translateUserIdFrom from './username';
import {getInternalHeaders} from '../../lib/utils';

function createUpdatePasswordContext(userInfo, request, password = '', token = '') {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo[0].userId}/password`),
		options: {
			headers: getInternalHeaders(request, {
				'Content-type': 'application/x-www-form-urlencoded',
			}),
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
