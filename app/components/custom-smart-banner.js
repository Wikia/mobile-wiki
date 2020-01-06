import Component from '@ember/component';
import { action } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { trackActions } from '../utils/track';

export default Component.extend(RespondsToScroll, {
  smartBanner: service(),
  wikiVariables: service(),

  classNames: ['smart-banner'],
  dayInMiliseconds: 86400000,
  // sync with scss variable $smart-banner-height
  fandomAppSmartBannerHeight: 85,
  trackCategory: 'custom-smart-banner',

  closeButtonSelector: '.smart-banner__close',
  smartBannerAdConfiguration: oneWay('wikiVariables.smartBannerAdConfiguration'),
  text: oneWay('smartBannerAdConfiguration.text'),
  linkUrl: oneWay('smartBannerAdConfiguration.linkUrl'),
  linkText: oneWay('smartBannerAdConfiguration.linkText'),
  imageUrl: oneWay('smartBannerAdConfiguration.imageUrl'),
  title: oneWay('smartBannerAdConfiguration.title'),

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
    this.smartBanner.setCookie(this.get('smartBanner.customCookieName'), this.get('options.daysHiddenAfterClose'));
    this.smartBanner.setVisibility(false);
    this.smartBanner.track(trackActions.close, this.trackCategory);
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
      document.body.classList.add('smart-banner-passed');
    } else {
      document.body.classList.remove('smart-banner-passed');
    }
  },
});
