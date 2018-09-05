import fetch from 'fetch';
import config from '../config/environment';

function logEvent(host, resource, name, description = {}) {
  const url = `${host}/event-logger`;

  if (config.environment === 'production') {
    fetch(`${url}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // sends cookie with request, allows for logging beaconId and sessionId
      credentials: 'include',
      body: JSON.stringify({
        name,
        description: JSON.stringify(description),
        client: 'mobile-wiki',
        client_version: config.APP.version,
      }),
    });
  }
}

export function logDebug(host, name, description) {
  logEvent(host, 'debug', name, description);
}

export function logError(host, name, description) {
  logEvent(host, 'error', name, description);
}
