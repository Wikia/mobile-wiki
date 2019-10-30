import { inject as service } from '@ember/service';
import { and, reads } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import Ads from '../modules/ads';

export default Component.extend(
  {
    adSlotBuilder: service('ads/ad-slot-builder'),
    ads: service('ads/ads'),

    classNames: ['main-page-modules', 'main-page-body'],
    tagName: 'section',

    title: reads('wikiVariables.siteName'),

    curatedContentToolButtonVisible: and('currentUser.rights.curatedcontent'),

    init() {
      this._super(...arguments);
    },

    /**
     * @returns {void}
     */
    didInsertElement() {
      this._super(...arguments);

      run.scheduleOnce('afterRender', this, () => {
        Ads.getLoadedInstance()
          .then(() => {
            this.ads.setupAdsContext(this.adsContext);

            if (!this.isDestroyed) {
              this.adSlotBuilder.injectMainPageAds(this);
            }
          })
          .catch(() => {}); // AdEngine not loaded.
      });
    },
  },
);
