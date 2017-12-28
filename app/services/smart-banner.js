import {computed} from '@ember/object';
import {and, equal, readOnly} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';
import {track} from '../utils/track';

export default Service.extend({
	currentUser: service(),
	wikiVariables: service(),

	smartBannerVisible: false,
	dayInMiliseconds: 86400000,

	dbName: readOnly('wikiVariables.dbName'),
	isUserLangEn: equal('currentUser.language', 'en'),
	shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
	isFandomAppSmartBannerVisible: and('shouldShowFandomAppSmartBanner', 'smartBannerVisible'),
	trackCategory: computed('shouldShowFandomAppSmartBanner', function () {
		return this.get('shouldShowFandomAppSmartBanner') ? 'fandom-app-smart-banner' : 'smart-banner';
	}),
	cookieName: computed('shouldShowFandomAppSmartBanner', function () {
		return this.get('shouldShowFandomAppSmartBanner') ? 'fandom-sb-closed' : 'sb-closed';
	}),

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
		const date = new Date();

		date.setTime(date.getTime() + (days * this.get('dayInMiliseconds')));
		$.cookie(this.get('cookieName'), 1, {
			expires: date,
			path: '/',
			// TODO is it needed?
			// domain: config.cookieDomain
		});
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
