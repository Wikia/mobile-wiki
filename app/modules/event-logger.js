import config from '../config/environment';
import fetch from 'fetch';

const url = `https://${config.services.domain}/${config.services.eventLogger.baseAPIPath}`;

function logEvent(resource, name, description = {}) {
	if (config.environment === 'production') {
		fetch(`${url}/${resource}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// sends cookie with request, allows for logging beaconId and sessionId
			credentials: 'include',
			body: JSON.stringify({
				name,
				description: JSON.stringify(description),
				client: 'mobile-wiki',
				client_version: config.APP.version
			})
		});
	}
}

export function logDebug(name, description) {
	logEvent('debug', name, description);
}

export function logError(name, description) {
	logEvent('error', name, description);
}
