import fetch from '@wikia/ember-fandom/services/fetch';
import config from '../config/environment';
import { FetchError } from '../utils/errors';

export default fetch.extend({
	init() {
		this.config = {
			internalCache: config.fastbootOnly.mediawikiDomain,
			servicesExternalHost: `https://${config.services.domain}`,
			servicesInternalHost: `https://${config.services.domain}`
		};

		this._super(...arguments);
	},

	fetchFromAnnouncements(path, options = {}) {
		let requestUrl = this.getServiceUrl('announcements', path);

		return this.fetchAndParseResponse(requestUrl, options, FetchError);
	},
});
