import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';
import translateUserIdFrom from './username';

function createResetPasswordContext(userInfo, request, redirect = '') {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo[0].userId}/reset_password`),
		options: {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded',
				'X-Client-Ip': request.headers['fastly-client-ip'] || request.info.remoteAddress,
				'X-Forwarded-For': request.headers['x-forwarded-for'] || request.info.remoteAddress
			},
			timeout: settings.helios.timeout,
			payload: `redirect=${redirect}`
		},
	};
}

function handleUserRegistrationResponse(data, redirect, request) {
	const userInfo = JSON.parse(data.payload),
		resetPassword = createResetPasswordContext(userInfo, request, redirect);

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
 * @param {Object} request
 * @returns {Promise}
 */
export default function resetPasswordFor(username, redirect, request) {
	return translateUserIdFrom(username, request)
		.then(data => {
			return handleUserRegistrationResponse(data, redirect, request);
		});
}
