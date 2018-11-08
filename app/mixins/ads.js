import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { getRenderComponentFor } from '../utils/render-component';

export default Mixin.create({
  ads: service(),
  currentUser: service(),

  init() {
    this._super(...arguments);
    this.renderAdComponent = getRenderComponentFor(this);
    this.waitingSlots = {};
  },

  /**
  * @param {string} adSlotName
  * @param {string} place
  * @param {Element} element
  * @param {string} waitKey
  * @returns {void}
  */
  appendAd(adSlotName, place, element, waitKey = '') {
    // Save waiting slots so queue can be cleared on transition
    this.waitingSlots[adSlotName] = () => {
      if (!this.get('ads.module').isSlotApplicable(adSlotName)) {
        return;
      }

      const placeholder = document.createElement('div');
      const attributes = this.get('ads.module').getAdSlotComponentAttributes(adSlotName);

      element.insertAdjacentElement(place, placeholder);

      attributes.pageHasFeaturedVideo = this.featuredVideo;

      this.ads.pushAdSlotComponent(adSlotName, this.renderAdComponent({
        name: 'ad-slot',
        attrs: attributes,
        element: placeholder,
      }));
    };

    this.ads.getWaits(waitKey).then(() => {
      if (this.waitingSlots[adSlotName]) {
        this.waitingSlots[adSlotName]();
        delete this.waitingSlots[adSlotName];
      }
      this.ads.clearWaits(adSlotName);
    });
  },

  appendHighImpactAd() {
    const adsData = this.get('ads.slotNames');
    const placeholder = document.createElement('div');
    const wikiContainer = document.getElementById('wikiContainer');

    if (wikiContainer && this.get('ads.module').isSlotApplicable(adsData.invisibleHighImpact2)) {
      wikiContainer.insertAdjacentElement('afterend', placeholder);
      const attributes = this.get('ads.module').getAdSlotComponentAttributes(adsData.invisibleHighImpact2);

      this.ads.pushAdSlotComponent(
          adsData.invisibleHighImpact2,
          this.renderAdComponent({
            name: 'ads/invisible-high-impact-2',
            attrs: attributes,
            element: placeholder,
          }),
      );
    }

    if (wikiContainer) {
      this.appendAd(adsData.invisibleHighImpact, 'afterend', wikiContainer);
    }
  },

  /**
  * @returns {void}
  */
  injectAds() {
    const { context } = window.Wikia.adEngine || {};

    const firstSection = this.element.parentNode.querySelector('.article-content > h2');
    const articleFooter = document.querySelector('.article-footer');
    const pi = document.querySelector('.portable-infobox-wrapper');
    const pageHeader = document.querySelector('.wiki-page-header');
    const adsData = this.get('ads.slotNames');
    const globalFooter = document.querySelector('.wds-global-footer');
    const slotsSwitchedWithAE3 = context && context.get('options.swapBottomLeaderboard');
    const slotsSwitched = this.adsContext.opts.isMobileBottomLeaderboardSwapEnabled
      || slotsSwitchedWithAE3;
    const afterArticleSlotName = slotsSwitched
      ? adsData.bottomLeaderBoard : adsData.mobilePreFooter;
    const beforeFooterSlotName = slotsSwitched
      ? adsData.mobilePreFooter : adsData.bottomLeaderBoard;

    if (pi) {
      // inject top mobileTopLeaderBoard below infobox
      this.appendAd(adsData.mobileTopLeaderBoard, 'afterend', pi);
    } else if (pageHeader && !this.featuredVideo) {
      // inject top mobileTopLeaderBoard below article header
      // only if there is no featured video embedded
      this.appendAd(adsData.mobileTopLeaderBoard, 'afterend', pageHeader);
    } else {
      this.get('ads.module').finishFirstCall();
    }

    if (firstSection) {
      this.appendAd(adsData.mobileInContent, 'beforebegin', firstSection);
    }

    if (articleFooter) {
      this.appendAd(afterArticleSlotName, 'beforebegin', articleFooter);
    }

    if (globalFooter) {
      this.appendAd(beforeFooterSlotName, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
    }

    this.appendHighImpactAd();
  },

  /**
  * Load ads for main page.
  * InContent ad should be displayed below curated content only when it's available.
  * Prefooter ad should be loaded above footer
  * only when trending articles and/or trending videos are loaded.
  *
  * @returns {void}
  */
  injectMainPageAds() {
    const adsData = this.get('ads.slotNames');
    const curatedContent = this.element.querySelector('.curated-content');
    const trendingArticles = this.element.querySelector('.trending-articles');
    const globalFooter = document.querySelector('.wds-global-footer');
    const slotsSwitched = this.adsContext.opts.isMobileBottomLeaderboardSwapEnabled;
    const afterArticleSlotName = slotsSwitched
      ? adsData.bottomLeaderBoard : adsData.mobilePreFooter;
    const beforeFooterSlotName = slotsSwitched
      ? adsData.mobilePreFooter : adsData.bottomLeaderBoard;

    this.appendAd(adsData.mobileTopLeaderBoard, 'beforebegin', this.element);

    if (curatedContent) {
      this.appendAd(adsData.mobileInContent, 'afterend', curatedContent);
    }

    if (trendingArticles) {
      this.appendAd(afterArticleSlotName, 'afterend', trendingArticles);
    }

    if (globalFooter) {
      this.appendAd(beforeFooterSlotName, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
    }

    this.appendHighImpactAd();
  },

  /**
  * @param {*} adsContext
  * @returns {void}
  */
  setupAdsContext(adsContext) {
    adsContext.user = {
      isAuthenticated: this.get('currentUser.isAuthenticated'),
    };
    this.waitingSlots = {};
    this.get('ads.module').afterTransition(adsContext);
  },
});
