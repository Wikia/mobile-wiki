import { defer } from 'rsvp';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import { run } from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import { logError } from '../modules/event-logger';
import { track, trackActions } from '../utils/track';
import { normalizeToUnderscore } from '../utils/string';
import recirculationBlacklist from '../utils/recirculationBlacklist';
import { TopArticlesFetchError, RecommendedDataFetchError } from '../utils/errors';

const recircItemsCount = 10;
const trackingCategory = 'recirculation';

export default Component.extend(
  InViewportMixin,
  {
    i18n: service(),
    logger: service(),
    ads: service('ads/ads'),
    router: service(),
    wikiVariables: service(),
    wikiUrls: service(),
    fetch: service(),
    sponsoredContent: service(),
    runtimeConfig: service(),

    classNames: ['recirculation-prefooter'],
    classNameBindings: ['items:has-items'],

    listRendered: null,
    requestId: null,
    topArticles: null,
    fallbackItems: null,
    items: null,
    sponsoredItemDisplayed: false,
    displayTopArticles: and('applicationWrapperVisible', 'topArticles.length'),
    displaySponsoredContent: and('applicationWrapperVisible', 'sponsoredItem'),
    sponsoredItem: reads('sponsoredContent.item'),
    wikiName: reads('wikiVariables.siteName'),

    sponsoredItemThumbnail: computed('sponsoredItem.thumbnailUrl', function () {
      return window.Vignette ? window.Vignette.getThumbURL(this.sponsoredItem.thumbnailUrl, {
        mode: window.Vignette.mode.zoomCrop,
        height: 386,
        width: 386,
      }) : this.sponsoredItem.thumbnail;
    }),

    sponsoredItemObserver: observer('sponsoredItem', 'sponsoredItemDisplayed', function () {
      if (this.sponsoredItem && this.sponsoredItemDisplayed) {
        // this tracking needs to be done in observer since the sponsored item is fetched async
        track({
          action: trackActions.impression,
          category: trackingCategory,
          label: `footer::${this.sponsoredItem.url}`,
        });
      }
    }),

    init() {
      this._super(...arguments);

      const viewportTolerance = 200;

      this.setProperties({
        viewportTolerance: {
          top: viewportTolerance,
          bottom: viewportTolerance,
          left: 0,
          right: 0,
        },
        intersectionThreshold: 0,
        listRendered: defer(),
      });

      this.ads.addWaitFor('RECIRCULATION_PREFOOTER', this.get('listRendered.promise'));

      recirculationBlacklist.clear();
    },

    actions: {
      postClick(post, index) {
        const labels = ['footer', `footer-slot-${index + 1}`];
        const additionalRecommendationData = {
          recommendation_request_id: this.requestId,
          item_id: post.id,
          item_type: 'wiki_article',
        };

        labels.forEach(label => track(Object.assign({
          action: trackActions.click,
          category: trackingCategory,
          label,
        }, additionalRecommendationData)));

        track(Object.assign({
          action: trackActions.select,
          category: trackingCategory,
          label: post.url,
        }, additionalRecommendationData));

        run.later(() => {
          window.location.assign(post.url);
        }, 200);
      },

      articleClick(title, index) {
        track({
          action: trackActions.click,
          category: trackingCategory,
          label: `more-wiki-${index}`,
        });

        this.router.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(title)));
      },

      sponsoredContentClick(sponsoredItem) {
        track({
          action: trackActions.click,
          category: trackingCategory,
          label: 'footer',
        });

        track({
          action: trackActions.click,
          category: trackingCategory,
          label: 'sponsored-item',
        });

        track({
          action: trackActions.select,
          category: trackingCategory,
          label: `footer::${sponsoredItem.url}`,
        });
      },
    },

    fetchTopArticles() {
      const url = this.wikiUrls.build({
        host: this.get('wikiVariables.host'),
        forceNoSSLOnServerSide: true,
        path: '/wikia.php',
        query: {
          controller: 'RecirculationApiController',
          method: 'getPopularPages',
          limit: 3 + recircItemsCount,
        },
      });

      this.fetch.fetchFromMediawiki(url, TopArticlesFetchError)
        .then((data) => {
          this.set('topArticles', data.slice(0, 3));
          this.set('fallbackItems', data.slice(3));

          if (!this.isDestroyed) {
            this.listRendered.resolve();
          }
        })
        .catch((error) => {
          this.logger.error(error.message);
          this.set('topArticles', []);
        });
    },

    fetchRecommendedData() {
      const qs = `?wikiId=${this.wikiVariables.id}&articleId=${this.articleId}&beacon=${window.beacon_id}`;
      const url = this.fetch.getServiceUrl('recommendations', `/recommendations${qs}`);

      this.fetch.fetchAndParseResponse(url, {}, RecommendedDataFetchError)
        .then((response) => {
          let filteredItems = this.getNonBlacklistedRecommendedData(response);

          if (filteredItems < recircItemsCount) {
            recirculationBlacklist.remove(5);

            logError(
              this.runtimeConfig.servicesExternalHost,
              'Recommendations',
              {
                reason: 'Not enough non-visited articles fetched from recommendation service',
                articleId: this.articleId,
              },
            );

            filteredItems = this.getNonBlacklistedRecommendedData(response);
          }

          this.set('items', filteredItems.map(item => ({
            id: item.item_id,
            site_name: item.wiki_title,
            url: item.url,
            title: item.article_title || item.wiki_title,
            thumbnail: window.Vignette.getThumbURL(item.thumbnail_url, {
              mode: window.Vignette.mode.zoomCrop,
              height: 386,
              width: 386,
            }),
          })));

          if (!this.isDestroyed) {
            this.listRendered.resolve();
          }
        })
        .catch((error) => {
          this.logger.error(error.message);

          this.set('items', this.fallbackItems);
        });
    },

    getNonBlacklistedRecommendedData(data) {
      const blacklistedItems = recirculationBlacklist.get();

      return data.article_recommendation
        .filter(el => blacklistedItems.indexOf(el.item_id) === -1)
        .concat(data.wiki_recommendation);
    },

    didEnterViewport() {
      if (this.applicationWrapperVisible) {
        this.fetchTopArticles();
        this.fetchRecommendedData();
        this.sponsoredContent.fetchData();

        this.set('sponsoredItemDisplayed', true);

        track({
          action: trackActions.impression,
          category: trackingCategory,
          label: 'footer',
        });
      }
    },
  },
);
