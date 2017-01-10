import Logger from '../../lib/logger';
import Promise from 'bluebird';
import settings from '../../../config/settings';
import Wreck from 'wreck';

function getUserRegistrationServiceUrlFrom(services) {
	const service = services[Math.floor(Math.random() * services.length)].Service;

	return `${service.Address}:${service.Port}`;
}

function createUserRegistrationContext(services, data, request) {
	return {
		url: `http://${getUserRegistrationServiceUrlFrom(services)}/users?username=${data.username}`,
		options: {
			headers: {
				'X-Wikia-Internal-Request': 1,
				'X-Client-Ip': request.headers['fastly-client-ip'] || request.info.remoteAddress,
				'X-Forwarded-For': request.headers['x-forwarded-for'] || request.info.remoteAddress
			},
			timeout: settings.userRegistationService.timeout
		}
	};
}

function handleServiceDiscoveryResponse(data, request) {
	const services = JSON.parse(data.payload),
		userDiscovery = createUserRegistrationContext(services, data, request);

	return new Promise((resolve, reject) => {
		Wreck.get(userDiscovery.url, userDiscovery.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				const userInfo = JSON.parse(payload);

				if (userInfo.length) {
					resolve({
						response,
						payload,
						username: data.username,
					});
				} else {
					response.statusCode = 404;

					reject({
						step: 'user-discovery',
						error: {},
						response,
						payload
					});
				}
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

function fetchHealthyUserRegistrationServices(username) {
	const serviceDiscovery = createServiceDiscoveryContext();

	return new Promise((resolve, reject) => {
		Wreck.get(serviceDiscovery.url, serviceDiscovery.options, (error, response, payload) => {
			if (response.statusCode === 200) {
				resolve({response, payload, username});
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
 * @param {Object} request
 * @returns {Promise}
 */
export default function translateUserIdFrom(username, request) {
	return fetchHealthyUserRegistrationServices(username)
		.then((data) => {
			return new Promise((resolve, reject) => {
				return handleServiceDiscoveryResponse(data, request);
			});
		});
}
