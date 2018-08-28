import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { trackActions } from '../utils/track';
import { system } from '../utils/browser';
import { inGroup } from '../modules/abtest';

export default Component.extend(RespondsToScroll, {
  i18n: service(),
  smartBanner: service(),
  wikiVariables: service(),

  classNames: ['fandom-app-smart-banner'],
  dayInMiliseconds: 86400000,
  // sync with scss variable $fandom-app-smart-banner-height
  fandomAppSmartBannerHeight: 85,

  closeButtonSelector: '.fandom-app-smart-banner__close',

  customText: computed('wikiVariables.fandomAppSmartBannerText', function () {
    return inGroup('SMARTBANNERCOPY', 'CUSTOM') && this.get('wikiVariables.fandomAppSmartBannerText')
      ? this.get('wikiVariables.fandomAppSmartBannerText')
      : null;
  }),

  link: computed(() => (system === 'ios'
    ? 'https://itunes.apple.com/us/app/fandom-powered-by-wikia/id1230063803?ls=1&mt=8'
    : 'https://play.google.com/store/apps/details'
   + '?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner')),

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
      this.smartBanner.setCookie(this.get('options.daysHiddenAfterClose'));
      this.smartBanner.setVisibility(false);
      this.smartBanner.track(trackActions.close);
    },
  },

  click(event) {
    if (event.target === this.element.querySelector(this.closeButtonSelector)) {
      return;
    }

    this.smartBanner.track(trackActions.install);
    this.smartBanner.setVisibility(false);
    this.smartBanner.setCookie(this.get('options.daysHiddenAfterView'));
  },

  scroll() {
    if (window.pageYOffset >= this.fandomAppSmartBannerHeight) {
      document.body.classList.add('fandom-app-smart-banner-passed');
    } else {
      document.body.classList.remove('fandom-app-smart-banner-passed');
    }
  },
});
