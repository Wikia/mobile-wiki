import * as authUtils from '../../lib/auth-utils';
import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';

function createResetPasswordContext(userInfo, data) {
	return {
		url: authUtils.getHeliosUrl(`/users/${userInfo.userId}/reset_password`),
		options: {
			timeout: settings.helios.timeout,
			payload: JSON.stringify({
				redirect: data.redirect
			})
		},
	};
}

function handleUserRegistrationResponse(data) {
	const userInfo = JSON.parse(data.payload),
		resetPassword = createResetPasswordContext(userInfo, data);

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

function getUserRegistrationServiceUrlFrom(services) {
	const service = services[Math.floor(Math.random() * services.length)].Service;

	return `${service.Address}:${service.Port}`;
}

function createUserRegistrationContext(services, data) {
	return {
		url: `http://${getUserRegistrationServiceUrlFrom(services)}/users?username=${data.username}`,
		options: {
			headers: {
				'X-Wikia-Internal-Request': 1
			},
			timeout: settings.userRegistationService.timeout
		}
	};
}

function handleServiceDiscoveryResponse(data) {
	const services = JSON.parse(data.payload),
		userDiscovery = createUserRegistrationContext(services, data);

	return new Promise((resolve, reject) => {
		Wreck.get(userDiscovery.url, userDiscovery.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({
					response,
					payload,
					username: data.username,
					redirect: data.redirect
				});
			} else {
				Logger.error({
					url: userDiscovery.url
				},
				'Error while discovering user info.');

				reject({
					step: 'user-discovery',
					error,
					response,
					payload
				});
			}
		});
	});
}

function createServiceDiscoveryContext() {
	return {
		url: `${settings.consul.internalUrl}${settings.userRegistationService.path}`,
		options: {
			timeout: settings.consul.timeout
		}
	};
}

function fetchHealthyUserRegistrationServices(username, redirect) {
	const serviceDiscovery = createServiceDiscoveryContext();

	return new Promise((resolve, reject) => {
		Wreck.get(serviceDiscovery.url, serviceDiscovery.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({response, payload, username, redirect});
			} else {
				Logger.error({
					url: serviceDiscovery.url
				},
				'Error while discovering user registration service.');

				reject({
					step: 'service-discovery',
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
	return fetchHealthyUserRegistrationServices(username, redirect)
		.then(handleServiceDiscoveryResponse)
		.then(handleUserRegistrationResponse);
}
