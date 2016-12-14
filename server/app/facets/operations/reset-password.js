import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';
import translateUserIdFrom from './username';

function createResetPasswordContext(userInfo, redirect) {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo.userId}/reset_password`),
		options: {
			timeout: settings.helios.timeout,
			payload: JSON.stringify({redirect})
		},
	};
}

function handleUserRegistrationResponse(data, redirect) {
	const userInfo = JSON.parse(data.payload),
		resetPassword = createResetPasswordContext(userInfo, redirect);

	return new Promise((resolve, reject) => {
		Wreck.post(resetPassword.url, resetPassword.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({
					payload: new Buffer(payload).toString('utf8')
				});
			} else {
				Logger.error({
					url: resetPassword.url,
				},
				'Error while resetting password.');

				reject({
					step: 'reset-password',
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
export default function resetPasswordFor(username, redirect) {
	return translateUserIdFrom(username)
		.then(data => {
			return handleUserRegistrationResponse(data, redirect);
		});
}
