import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { inGroup } from '../modules/abtest';
import { system } from '../utils/browser';
import { trackActions } from '../utils/track';

export default Component.extend(RespondsToScroll, {
  i18n: service(),
  smartBanner: service(),
  wikiVariables: service(),

  classNames: ['smart-banner'],
  dayInMiliseconds: 86400000,
  // sync with scss variable $smart-banner-height
  fandomAppSmartBannerHeight: 85,
  trackCategory: 'smart-banner',

  closeButtonSelector: '.smart-banner__close',

  customText: computed('wikiVariables.fandomAppSmartBannerText', function () {
    return inGroup('SMARTBANNERCOPY', 'CUSTOM') && this.get('wikiVariables.fandomAppSmartBannerText')
      ? this.get('wikiVariables.fandomAppSmartBannerText')
      : null;
  }),

  link: computed(function () {
    return system === 'ios'
      ? 'https://itunes.apple.com/us/app/fandom-powered-by-wikia/id1230063803?ls=1&mt=8'
      : 'https://play.google.com/store/apps/details'
      + '?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner';
  }),

  storeName: computed(function () {
    return system === 'ios'
      ? this.i18n.t('fandom-app-banner.app-store')
      : this.i18n.t('fandom-app-banner.google-play');
  }),

  init() {
    this._super(...arguments);

    this.options = {
      // Duration to hide the banner after close button is clicked (0 = always show banner)
      daysHiddenAfterClose: 30,
      // Duration to hide the banner after it is clicked (0 = always show banner)
      daysHiddenAfterView: 90,
    };
  },

  /**
   * @returns {void}
   */
  @action
  close() {
    this.smartBanner.setCookie(this.get('smartBanner.fandomAppCookieName'), this.get('options.daysHiddenAfterClose'));
    this.smartBanner.setVisibility(false);
    this.smartBanner.track(trackActions.close, this.trackCategory);
  },

  click(event) {
    if (event.target === this.element.querySelector(this.closeButtonSelector)) {
      return;
    }

    this.smartBanner.track(trackActions.install, this.trackCategory);
    this.smartBanner.setVisibility(false);
    this.smartBanner.setCookie(this.get('smartBanner.fandomAppCookieName'), this.get('options.daysHiddenAfterView'));
  },

  scroll() {
    if (window.pageYOffset >= this.fandomAppSmartBannerHeight) {
      document.body.classList.add('smart-banner-passed');
    } else {
      document.body.classList.remove('smart-banner-passed');
    }
  },
});
