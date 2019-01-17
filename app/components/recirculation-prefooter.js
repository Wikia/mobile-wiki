import { defer } from 'rsvp';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { reads, and } from '@ember/object/computed';
import { run } from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import { track, trackActions } from '../utils/track';
import { normalizeToUnderscore } from '../utils/string';
import { TopArticlesFetchError } from '../utils/errors';

const recircItemsCount = 10;
const trackingCategory = 'recirculation';

export default Component.extend(
  InViewportMixin,
  {
    i18n: service(),
    logger: service(),
    ads: service(),
    router: service(),
    wikiVariables: service(),
    wikiUrls: service(),
    fetch: service(),
    sponsoredContent: service(),

    classNames: ['recirculation-prefooter'],
    classNameBindings: ['items:has-items'],

    listRendered: null,
    displayTopArticles: and('applicationWrapperVisible', 'topArticles.length'),
    displaySponsoredContent: and('applicationWrapperVisible', 'sponsoredItem'),
    sponsoredItem: reads('sponsoredContent.item'),
    wikiName: reads('wikiVariables.siteName'),

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
    },

    actions: {
      postClick(post, index) {
        const labels = ['footer', `footer-slot-${index + 1}`];

        labels.forEach(label => track({
          action: trackActions.click,
          category: trackingCategory,
          label,
        }));

        track({
          action: trackActions.select,
          category: trackingCategory,
          label: post.url,
        });

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
          label: sponsoredItem.url,
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
          this.set('items', data.slice(3));

          if (!this.isDestroyed) {
            this.listRendered.resolve();
          }
        })
        .catch((error) => {
          this.logger.error(error.message);
          this.set('topArticles', []);
        });
    },

    didEnterViewport() {
      if (this.applicationWrapperVisible) {
        this.fetchTopArticles();
        this.sponsoredContent.fetchData();
        track({
          action: trackActions.impression,
          category: trackingCategory,
          label: 'footer',
        });
      }
    },
  },
);
