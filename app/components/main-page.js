import { inject as service } from '@ember/service';
import { reads, and } from '@ember/object/computed';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import Ads from '../modules/ads';
import AdsMixin from '../mixins/ads';

export default Component.extend(
  AdsMixin,
  {
    ads: service('ads/ads'),
    currentUser: service(),
    wikiVariables: service(),

    classNames: ['main-page-modules', 'main-page-body'],
    tagName: 'section',

    title: reads('wikiVariables.siteName'),

    curatedContentToolButtonVisible: and('currentUser.rights.curatedcontent'),

    /**
   * @returns {void}
   */
    didInsertElement() {
      this._super(...arguments);

      run.scheduleOnce('afterRender', this, () => {
        Ads.waitForAdEngine().then((ads) => {
          this.setupAdsContext(this.adsContext);
          ads.onReady(() => {
            if (!this.isDestroyed) {
              this.injectMainPageAds();
            }
          });
        });
      });
    },
  },
);
