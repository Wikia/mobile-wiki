import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';
import translateUserIdFrom from './username';

function createUpdatePasswordContext(userInfo, password, token) {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo.userId}/password`),
		options: {
			timeout: settings.helios.timeout,
			payload: JSON.stringify({
				password,
				token
			})
		},
	};
}

function handleUserRegistrationResponse(data, password, token) {
	const userInfo = JSON.parse(data.payload),
		updatePassword = createUpdatePasswordContext(userInfo, password, token);

	return new Promise((resolve, reject) => {
		Wreck.post(updatePassword.url, updatePassword.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({
					payload: new Buffer(payload).toString('utf8')
				});
			} else {
				Logger.error({
					url: updatePassword.url,
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
 * @param {string} redirect
 * @returns {Promise}
 */
export default function updatePasswordFor(username, password, token) {
	return translateUserIdFrom(username)
		.then(data => {
			return handleUserRegistrationResponse(data, password, token);
		});
}
