import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { computed } from '@ember/object';
import { track, trackActions } from '../utils/track';
import { system } from '../utils/browser';

export default Component.extend(
  {
    wikiVariables: service(),
    geo: service(),

    tagName: '',

    buttonLabel: oneWay('wikiVariables.watchShowButtonLabel'),
    imageUrl: oneWay('wikiVariables.watchShowImageURL'),
    cta: oneWay('wikiVariables.watchShowCTA'),
    trackingPixelURL: oneWay('wikiVariables.watchShowTrackingPixelURL'),

    url: computed('wikiVariables.{watchShowURL,watchShowURLIOS,watchShowURLAndroid}', function () {
      if (this.wikiVariables.watchShowURL) {
        return this.wikiVariables.watchShowURL;
      }

      if (system === 'ios') {
        return this.wikiVariables.watchShowURLIOS;
      }

      return this.wikiVariables.watchShowURLAndroid;
    }),

    isVisible: computed('url', 'buttonLabel', 'geo', function () {
      return this.url && this.buttonLabel && this.geo.country === 'US';
    }),

    didInsertElement() {
      this._super(...arguments);

      if (!this.isVisible) {
        return;
      }

      track({
        action: trackActions.impression,
        category: 'article',
        label: 'watch-show',
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
        label: 'watch-show',
      });
    },
  },
);
