import config from '../config/environment';
import fetch from 'fetch';

const url = `https://${config.services.domain}/${config.services.eventLogger.baseAPIPath}/error`;

export function logEvent(name, description) {
	console.log(url);
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		// sends cookie with request, allows for logging beaconId and sessionId
		credentials: 'include',
		body: JSON.stringify({
			name: name,
			description: JSON.stringify(description),
			client: 'mobile-wiki'
		})
	});
}