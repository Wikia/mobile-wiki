import config from '../config/environment';
import fetch from 'fetch';
import Ember from 'ember';

export function initialize(/* appInstance */) {
	if (typeof FastBoot !== 'undefined') {
		return;
	}

	Ember.onerror = function (error) {
		const url = `https://${config.services.domain}/${config.services.eventLogger.baseAPIPath}/error`;

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				name: 'Ember.onerror',
				description: JSON.stringify({
					message: error.message,
					stack: error.stack,
				}),
				client: 'mobile-wiki'
			})
		});

		// To be able to display it in console
		throw error;
	};
}

export default {
	after: 'config',
	name: 'error-logger',
	initialize
};
