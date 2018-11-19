import { computed } from '@ember/object';
import { and, equal, readOnly } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { track } from '../utils/track';
import { system } from '../utils/browser';
import getAdsModule from '../modules/ads';

export default Service.extend({
  currentUser: service(),
  wikiVariables: service(),
  runtimeConfig: service(),

  smartBannerVisible: false,
  dayInMiliseconds: 86400000,
  fandomAppCookieName: 'fandom-sb-closed',
  customCookieName: 'custom-sb-closed',
  willUapNotAppear: false,

  dbName: readOnly('wikiVariables.dbName'),
  smartBannerAdConfiguration: readOnly('wikiVariables.smartBannerAdConfiguration'),
  isUserLangEn: equal('currentUser.language', 'en'),
  shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
  isFandomAppSmartBannerVisible: computed('shouldShowFandomAppSmartBanner', 'smartBannerVisible', function () {
    return this.shouldShowFandomAppSmartBanner
      && this.smartBannerVisible
      && !this.isCustomSmartBannerVisible
      && this.willUapNotAppear;
  }),

  isCustomSmartBannerVisible: and(
    'shouldShowFandomAppSmartBanner',
    'smartBannerVisible',
    'smartBannerAdConfiguration.text',
    'isInCustomSmartBannerCountry',
    'isSystemTargetedByCustomSmartBanner',
    'willUapNotAppear',
  ),

  init() {
    this._super(...arguments);

    getAdsModule()
    // Use noUap callback to allow SmartBanner to show up. This prevents SB from showing up too soon
    // and then being replaced by UAP
      .then(adsModule => adsModule.waitForUapResponse(() => {}, () => {
        this.set('willUapNotAppear', true);
      }));
  },

  isInCustomSmartBannerCountry: computed('smartBannerAdConfiguration.countries', function () {
    const customSmartBannerCountries = (this.smartBannerAdConfiguration.countries || [])
      .map(item => item.toLowerCase());
    let currentCountry;

    if (customSmartBannerCountries.indexOf('xx') !== -1) {
      return true;
    }

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

  isSystemTargetedByCustomSmartBanner: computed('smartBannerAdConfiguration.os', function () {
    const osList = this.smartBannerAdConfiguration.os;

    return osList.indexOf(system) !== -1;
  }),

  setVisibility(state) {
    this.set('smartBannerVisible', state);
  },

  /**
   * Sets smart banner cookie for given number of days
   *
   * @param {string} cookieName
   * @param {number} days
   * @returns {void}
   */
  setCookie(cookieName, days) {
    const date = new Date();
    const cookieOptions = {
      expires: date,
      path: '/',
      domain: this.runtimeConfig.cookieDomain,
    };

    date.setTime(date.getTime() + (days * this.dayInMiliseconds));
    window.Cookies.set(cookieName, 1, cookieOptions);
  },

  isCookieSet(cookieName) {
    return window.Cookies.get(cookieName) === '1';
  },

  /**
   * @param {string} action
   * @param {string} category
   * @returns {void}
   */
  track(action, category) {
    track({
      action,
      category,
      label: this.dbName,
    });
  },
});
