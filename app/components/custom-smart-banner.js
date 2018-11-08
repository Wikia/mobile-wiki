import Component from '@ember/component';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { system } from '../utils/browser';
import { trackActions } from '../utils/track';

export default Component.extend(RespondsToScroll, {
  i18n: service(),
  smartBanner: service(),
  wikiVariables: service(),

  classNames: ['fandom-app-smart-banner'],
  dayInMiliseconds: 86400000,
  // sync with scss variable $fandom-app-smart-banner-height
  fandomAppSmartBannerHeight: 85,
  trackCategory: 'custom-smart-banner',

  closeButtonSelector: '.fandom-app-smart-banner__close',
  smartBannerAdConfiguration: oneWay('wikiVariables.smartBannerAdConfiguration'),
  text: oneWay('smartBannerAdConfiguration.text'),
  linkUrl: oneWay('smartBannerAdConfiguration.linkUrl'),
  linkText: oneWay('smartBannerAdConfiguration.linkText'),
  imageUrl: oneWay('smartBannerAdConfiguration.imageUrl'),
  title: oneWay('smartBannerAdConfiguration.title'),

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

  actions: {
    /**
   * @returns {void}
   */
    close() {
      this.smartBanner.setCookie(this.get('smartBanner.customCookieName'), this.get('options.daysHiddenAfterClose'));
      this.smartBanner.setVisibility(false);
      this.smartBanner.track(trackActions.close, this.trackCategory);
    },
  },

  click(event) {
    if (event.target === this.element.querySelector(this.closeButtonSelector)) {
      return;
    }

    this.smartBanner.track(trackActions.install, this.trackCategory);
    this.smartBanner.setVisibility(false);
    this.smartBanner.setCookie(this.get('smartBanner.customCookieName'), this.get('options.daysHiddenAfterView'));
  },

  scroll() {
    if (window.pageYOffset >= this.fandomAppSmartBannerHeight) {
      document.body.classList.add('fandom-app-smart-banner-passed');
    } else {
      document.body.classList.remove('fandom-app-smart-banner-passed');
    }
  },
});
