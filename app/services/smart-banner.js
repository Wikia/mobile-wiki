import { computed } from '@ember/object';
import {
  and,
  equal,
  readOnly,
  or,
} from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import { track } from '../utils/track';
import { system } from '../utils/browser';
import Ads from '../modules/ads';

export default Service.extend({
  currentUser: service(),
  fastboot: service(),
  wikiVariables: service(),
  runtimeConfig: service(),
  geo: service(),

  smartBannerVisible: false,
  dayInMiliseconds: 86400000,
  fandomAppCookieName: 'fandom-sb-closed',
  customCookieName: 'custom-sb-closed',
  willUapNotAppearForAnon: false,
  willUapNotAppear: or('currentUser.isAuthenticated', 'willUapNotAppearForAnon'),

  wikiId: readOnly('wikiVariables.id'),
  dbName: readOnly('wikiVariables.dbName'),
  smartBannerAdConfiguration: readOnly('wikiVariables.smartBannerAdConfiguration'),
  isUserLangEn: equal('currentUser.language', 'en'),
  shouldShowFandomAppSmartBanner: false, //and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
  isFandomAppSmartBannerVisible: computed(
    'shouldShowFandomAppSmartBanner',
    'smartBannerVisible',
    'willUapNotAppear',
    function () {
      return this.shouldShowFandomAppSmartBanner
        && this.smartBannerVisible
        && !this.isCustomSmartBannerVisible
        && this.willUapNotAppear
        // temporary hide smart banner for some communities
        && [
          534, 673, 91319, 1031035, 835, 376, 881799, 8646,
          4728, 200383, 10960, 7683, 2632, 1639458, 46732, 1049743,
        ].indexOf(this.wikiId) === -1;
    },
  ),

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

    // Use noUap callback to allow SmartBanner to show up. This prevents SB from showing up too soon
    // and then being replaced by UAP
    if (!this.fastboot.get('isFastBoot')) {
      Ads.getLoadedInstance()
        .then((ads) => {
          ads.waitForUapResponse().then((isUapLoaded) => {
            if (!isUapLoaded) {
              this.set('willUapNotAppearForAnon', true);
            }
          });
        })
        .catch(() => {
          // Ads not loaded.
          this.set('willUapNotAppearForAnon', true);
        });
    }
  },

  isInCustomSmartBannerCountry: computed('smartBannerAdConfiguration.countries', function () {
    const customSmartBannerCountries = (this.smartBannerAdConfiguration.countries || [])
      .map(item => item.toLowerCase());
    const currentCountry = this.geo.country;

    if (customSmartBannerCountries.indexOf('xx') !== -1) {
      return true;
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
