import {computed} from '@ember/object';
import {and, equal, readOnly} from '@ember/object/computed';
import Service, {inject as service} from '@ember/service';
import {track} from '../utils/track';
import {system} from '../utils/browser';

export default Service.extend({
  currentUser: service(),
  wikiVariables: service(),
  runtimeConfig: service(),

  smartBannerVisible: false,
  dayInMiliseconds: 86400000,
  cookieName: 'fandom-sb-closed',
  trackCategory: 'fandom-app-smart-banner',

  dbName: readOnly('wikiVariables.dbName'),
  isUserLangEn: equal('currentUser.language', 'en'),
  shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
  isFandomAppSmartBannerVisible: computed('shouldShowFandomAppSmartBanner', 'smartBannerVisible', function () {
    return this.get('shouldShowFandomAppSmartBanner') &&
      this.get('smartBannerVisible') &&
      !this.get('isCustomSmartBannerVisible');
  }),
  isCustomSmartBannerVisible: and(
    'shouldShowFandomAppSmartBanner',
    'smartBannerVisible',
    'wikiVariables.smartBannerAdConfiguration.text',
    'isInCustomSmartBannerCountry',
    'isSystemTargetedByCustomSmartBanner',
  ),

  isInCustomSmartBannerCountry: computed('wikiVariables.smartBannerAdConfiguration.countries', function () {
    const customSmartBannerCountries = this.get('wikiVariables.smartBannerAdConfiguration.countries') || [];
    let currentCountry;

    try {
      const cookie = window.Cookies.get('Geo');
      currentCountry = (JSON.parse(cookie) || {}).country;
    } catch (e) {
      return false;
    }

    if (!currentCountry) {
      return false;
    }

    return customSmartBannerCountries.indexOf(currentCountry.toLowerCase()) !== -1;
  }),

  isSystemTargetedByCustomSmartBanner: computed('wikiVariables.smartBannerAdConfiguration.os', function () {
    const osList = this.get('wikiVariables.smartBannerAdConfiguration.os');

    return osList.indexOf(system) !== -1;
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
    const cookieOptions = {
      expires: date,
      path: '/',
      domain: this.runtimeConfig.cookieDomain,
    };

    date.setTime(date.getTime() + (days * this.dayInMiliseconds));
    window.Cookies.set(this.cookieName, 1, cookieOptions);
  },

  isCookieSet() {
    return window.Cookies.get(this.cookieName) === '1';
  },

  /**
   * @param {string} action
   * @returns {void}
   */
  track(action) {
    track({
      action,
      category: this.trackCategory,
      label: this.dbName,
    });
  },
});
