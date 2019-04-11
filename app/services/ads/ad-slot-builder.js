import offset from '@wikia/ember-fandom/utils/offset';
import Service, { inject as service } from '@ember/service';
import { getRenderComponentFor } from '../../utils/render-component';

const MIN_ZEROTH_SECTION_LENGTH = 700;

export default Service.extend({
  ads: service('ads/ads'),
  currentUser: service(),
  pageHasFeaturedVideo: false,

  init() {
    this._super(...arguments);
    this.waitingSlots = {};
  },

  /**
   * @returns {void}
   */
  injectAds(component) {
    this.setupComponent(component);

    const element = this.component.element;
    const firstSection = Array.prototype.slice
      .call(element.parentNode.querySelectorAll('.article-content > h2'))
      .find(el => (offset(el).top || 0) > MIN_ZEROTH_SECTION_LENGTH);
    const articleFooter = document.querySelector('.article-footer');
    const pi = document.querySelector('.portable-infobox-wrapper');
    const pageHeader = document.querySelector('.wiki-page-header');
    const adsData = this.ads.slotNames;
    const globalFooter = document.querySelector('.wds-global-footer');
    this.pageHasFeaturedVideo = !!component.featuredVideo;

    if (pi) {
      // inject top topLeaderBoard below infobox
      this.appendAd(adsData.topLeaderBoard, 'afterend', pi);
    } else if (pageHeader && !this.pageHasFeaturedVideo) {
      // inject top topLeaderBoard below article header
      // but only if there is no featured video embedded
      this.appendAd(adsData.topLeaderBoard, 'afterend', pageHeader);
    }

    if (firstSection) {
      this.appendAd(adsData.mobileInContent, 'beforebegin', firstSection);
    }

    if (articleFooter) {
      this.appendAd(adsData.bottomLeaderBoard, 'beforebegin', articleFooter);
    }

    if (globalFooter) {
      this.appendAd(adsData.mobilePreFooter, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
    }

    this.appendHighImpactAd();
  },

  /**
   * @returns {void}
   */
  injectSearchPageTopLeaderboard(component) {
    this.setupComponent(component);

    const element = this.component.element;
    const adsData = this.ads.slotNames;

    this.appendAd(adsData.topLeaderBoard, 'afterend', element);
  },

  /**
   * @returns {void}
   */
  injectSearchPageNative(component) {
    this.setupComponent(component);

    const element = this.component.element;
    const adsData = this.ads.slotNames;

    this.appendAd(adsData.incontentNative, 'afterend', element);
  },

  /**
   * Load ads for main page.
   * InContent ad should be displayed below curated content only when it's available.
   * Prefooter ad should be loaded above footer
   * only when trending articles and/or trending videos are loaded.
   *
   * @returns {void}
   */
  injectMainPageAds(component) {
    this.setupComponent(component);

    const element = this.component.element;
    const adsData = this.ads.slotNames;
    const curatedContent = element.querySelector('.curated-content');
    const trendingArticles = element.querySelector('.trending-articles');
    const globalFooter = document.querySelector('.wds-global-footer');

    this.appendAd(adsData.topLeaderBoard, 'beforebegin', element);

    if (curatedContent) {
      this.appendAd(adsData.mobileInContent, 'afterend', curatedContent);
    }

    if (trendingArticles) {
      this.appendAd(adsData.bottomLeaderBoard, 'afterend', trendingArticles);
    }

    if (globalFooter) {
      this.appendAd(adsData.mobilePreFooter, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
    }

    this.appendHighImpactAd();
  },

  /**
   * @private
   */
  appendHighImpactAd() {
    const adsData = this.ads.slotNames;
    const placeholder = document.createElement('div');
    const wikiContainer = document.getElementById('wikiContainer');

    if (wikiContainer) {
      wikiContainer.insertAdjacentElement('afterend', placeholder);
      const attributes = this.get('ads.module')
        .getAdSlotComponentAttributes(adsData.invisibleHighImpact2);

      this.ads.pushAdSlotComponent(
        adsData.invisibleHighImpact2,
        this.renderAdComponent({
          name: 'ads/invisible-high-impact-2',
          attrs: attributes,
          element: placeholder,
        }),
      );
    }
  },

  /**
   * @private
   * @param {string} adSlotName
   * @param {string} place
   * @param {Element} element
   * @param {string} waitKey
   * @returns {void}
   */
  appendAd(adSlotName, place, element, waitKey = '') {
    // Save waiting slots so queue can be cleared on transition
    this.waitingSlots[adSlotName] = () => {
      const placeholder = document.createElement('div');
      const attributes = this.get('ads.module').getAdSlotComponentAttributes(adSlotName);
      attributes.pageHasFeaturedVideo = this.pageHasFeaturedVideo;

      element.insertAdjacentElement(place, placeholder);

      this.ads.pushAdSlotComponent(adSlotName, this.renderAdComponent({
        name: 'ad-slot',
        attrs: attributes,
        element: placeholder,
      }));
    };

    this.ads.getWaitsOf(waitKey)
      .then(() => {
        if (this.waitingSlots[adSlotName]) {
          this.waitingSlots[adSlotName]();
          delete this.waitingSlots[adSlotName];
        }
        this.ads.clearWaitsOf(adSlotName);
      });
  },

  /**
   * @private
   * @param component - Ember Component. Parent for ad slots.
   */
  setupComponent(component) {
    this.component = component;
    this.renderAdComponent = getRenderComponentFor(component);
    this.waitingSlots = {};
  },
});
