import config from '../config/environment';
import {escapeRegex} from './string';

/**
 * @param {Object} request - FastBoot request
 * @returns {string}
 */
export default function getHostFromRequest(request) {
	// We use two special domain prefixes for Ad Operations and Sales reasons
	// Their purpose is to allow separate targeting by having a different domain in the browser
	// We still want to call production API with non-prefixed host
	// See https://github.com/Wikia/wikia-vcl/blob/master/wikia.com/control-stage.vcl
	const headers = request.get('headers');
	// One of our layers cuts out sandbox-* prefix from the host, use x-original-host instead
	let host = headers.get('x-original-host') || request.get('host');

	if (headers.get('x-staging') === 'externaltest') {
		const stagingRegex = new RegExp(`\\.(externaltest|showcase)\\.${escapeRegex(config.wikiaBaseDomain)}$`);
		host = host.replace(stagingRegex, `.${config.wikiaBaseDomain}`);
	}

	return host;
}
