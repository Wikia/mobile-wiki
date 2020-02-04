import { Promise } from 'rsvp';
import Service from '@ember/service';

export default function (owner) {
  owner.register('service:ads/search-page-ads-context', Service.extend({
    init() {
      this._super(...arguments);
    },

    getAdsContext() {
      return Promise.resolve({
        opts: {
          adsInContent: 1,
          delayBtf: true,
          enableAdsInMaps: true,
          enableCheshireCat: false,
          pageType: 'search',
          showAds: true,
          isAdTestWiki: true,
        },
        targeting: {
          enablePageCategories: true,
          esrbRating: 'teen',
          mappedVerticalName: 'life',
          pageName: 'Special:Search',
          pageType: 'search',
          skin: 'mercury',
          wikiDbName: 'project43',
          wikiId: '1265146',
          wikiIsTop1000: true,
          wikiLanguage: 'en',
          wikiVertical: 'lifestyle',
        },
        providers: [],
        slots: { invisibleHighImpact: true },
        forcedProvider: null,
      });
    },
  }));
}
