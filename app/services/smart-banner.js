import {computed} from '@ember/object';
import {and, equal, readOnly} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';
import {track} from '../utils/track';
import config from '../config/environment';

export default Service.extend({
	currentUser: service(),
	wikiVariables: service(),

	smartBannerVisible: false,
	dayInMiliseconds: 86400000,
	cookieName: 'fandom-sb-closed',

	dbName: readOnly('wikiVariables.dbName'),
	isUserLangEn: equal('currentUser.language', 'en'),
	shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
	isFandomAppSmartBannerVisible: and('shouldShowFandomAppSmartBanner', 'smartBannerVisible'),
	trackCategory: 'smart-banner',

	setVisibility(state) {
		this.set('smartBannerVisible', state);
	},

	/**
	 * Sets smart banner cookie for given number of days
	 *
	 * @param {number} days
	 * @returns {void}
	 */
	setCookie(days) {
		const date = new Date(),
			cookieOptions = {
				expires: date,
				path: '/',
				domain: config.cookieDomain
			};

		date.setTime(date.getTime() + (days * this.get('dayInMiliseconds')));
		$.cookie(this.get('cookieName'), 1, cookieOptions);
	},

	isCookieSet() {
		return $.cookie(this.get('cookieName')) === '1';
	},

	/**
	 * @param {string} action
	 * @returns {void}
	 */
	track(action) {
		track({
			action,
			category: this.get('trackCategory'),
			label: this.get('dbName')
		});
	},
});
