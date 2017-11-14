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
			body: JSON.stringify({
				name: 'Ember.onerror',
				description: JSON.stringify(error),
				client: 'mobile-wiki'
			})
		});
	};
}

export default {
	after: 'config',
	name: 'error-logger',
	initialize
};
