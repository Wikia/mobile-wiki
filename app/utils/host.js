/**
 * @param {Object} request - FastBoot request
 * @returns {string}
 */
export default function getHostFromRequest(request) {
	// We use two special domain prefixes for Ad Operations and Sales reasons
	// Their purpose is to allow separate targeting by having a different domain in the browser
	// We still want to call production API with non-prefixed host
	// See https://github.com/Wikia/wikia-vcl/blob/master/wikia.com/control-stage.vcl
	if (request.get('headers').get('x-staging') === 'externaltest') {
		return request.get('host').replace(/^(externaltest|showcase)\./, '');
	}

	return request.get('host');
}
