import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import { track, trackActions } from '../utils/track';
import { system } from '../utils/browser';
import { isDarkTheme } from '../utils/mobile-app';

export default Component.extend(
  {
    wikiVariables: service(),
    geo: service(),

    tagName: '',

    buttonLabel: oneWay('wikiVariables.watchShowButtonLabel'),
    cta: oneWay('wikiVariables.watchShowCTA'),
    trackingPixelURL: oneWay('wikiVariables.watchShowTrackingPixelURL'),

    imageUrl: computed('wikiVariables.{watchShowImageURL,watchShowImageURLDarkTheme}', function () {
      if (isDarkTheme() && this.wikiVariables.watchShowImageURLDarkTheme) {
        return this.wikiVariables.watchShowImageURLDarkTheme;
      }

      return this.wikiVariables.watchShowImageURL;
    }),

    url: computed('wikiVariables.{watchShowURL,watchShowURLIOS,watchShowURLAndroid}', function () {
      if (this.wikiVariables.watchShowURL) {
        return this.wikiVariables.watchShowURL;
      }

      if (system === 'ios') {
        return this.wikiVariables.watchShowURLIOS;
      }

      return this.wikiVariables.watchShowURLAndroid;
    }),

    isVisible: computed('url', 'buttonLabel', 'geo', 'wikiVariables', function () {
      const isEnabled = Date.parse(this.wikiVariables.watchShowEnabledDate) < Date.now();
      const isProperGeo = Array.isArray(this.wikiVariables.watchShowGeos)
        && this.wikiVariables.watchShowGeos.indexOf(this.geo.country) > -1;

      return isEnabled && isProperGeo && this.url && this.buttonLabel;
    }),

    didInsertElement() {
      this._super(...arguments);

      if (!this.isVisible) {
        return;
      }

      track({
        action: trackActions.impression,
        category: 'article',
        label: `watch-${this.wikiVariables.watchShowTrackingLabel}`,
      });

      if (this.trackingPixelURL) {
        const img = document.createElement('img');

        img.width = 0;
        img.height = 0;
        img.src = this.trackingPixelURL;

        document.body.appendChild(img);
      }
    },

    trackClick() {
      track({
        action: trackActions.click,
        category: 'article',
        label: `watch-${this.wikiVariables.watchShowTrackingLabel}`,
      });
    },
  },
);
