import config from '../config/environment';
import { escapeRegex } from '../utils/string';

/**
 * @param {Object} request - FastBoot request
 * @returns {string}
 */
export function getHostFromRequest(request) {
	// We use two special domain prefixes for Ad Operations and Sales reasons
	// Their purpose is to allow separate targeting by having a different domain in the browser
	// We still want to call production API with non-prefixed host
	// See https://github.com/Wikia/wikia-vcl/blob/master/wikia.com/control-stage.vcl
	const headers = request.get('headers');
	// One of our layers cuts out sandbox-* prefix from the host, use x-original-host instead
	let host = headers.get('x-original-host') || request.get('host');

	if (headers.get('x-staging') === 'externaltest') {
		// Support both wikia.com and fandom.com domains during the migration period
		let baseDomain = config.productionBaseDomain;
		if (host.indexOf(`.${config.alternateBaseDomain}`) > -1) {
			baseDomain = config.alternateBaseDomain;
		}
		const stagingRegex = new RegExp(`\\.(externaltest|showcase)\\.${escapeRegex(baseDomain)}$`);
		host = host.replace(stagingRegex, `.${baseDomain}`);
	}

	return host;
}

export function initialize(applicationInstance) {
	let fastboot = applicationInstance.lookup('service:fastboot');

	if (fastboot.get('isFastBoot')) {
		const request = fastboot.get('request');
		const host = getHostFromRequest(request);

		// FastBoot uses request host for redirect location
		// See https://github.com/ember-fastboot/ember-cli-fastboot/blob/master/app/locations/none.js
		// After deploy the host is sth like http://mobile-wiki-prod.prod.sjc.k8s.wikia.net
		// To fix the redirects we override the host with the original one
		request.set('host', host);
	}
}


export default {
	name: 'request-host',
	initialize
};
