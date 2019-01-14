import { defer } from 'rsvp';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { reads, equal, and } from '@ember/object/computed';
import { run } from '@ember/runloop';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from '../modules/thumbnailer';
import { normalizeThumbWidth } from '../utils/thumbnail';
import { track, trackActions } from '../utils/track';
import { normalizeToUnderscore } from '../utils/string';
import { TopArticlesFetchError } from '../utils/errors';

const recircItemsCount = 10;
const config = {
  // we load twice as many items as we want to display
  // because we need to filter out those without thumbnail
  max: recircItemsCount * 2,
  widget: 'wikia-impactfooter',
  source: 'fandom',
  opts: {
    resultType: 'cross-domain',
    domainType: 'fandom.wikia.com',
  },
};

export default Component.extend(
  InViewportMixin,
  {
    wdsLiftigniter: service(),
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
    isContLangEn: equal('wikiVariables.language.content', 'en'),
    displayLiftigniterRecirculation: and('isContLangEn', 'applicationWrapperVisible'),
    displayTopArticles: and('applicationWrapperVisible', 'topArticles.length'),
    displaySponsoredContent: and('applicationWrapperVisible', 'sponsoredContent.items.length'),
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
        const labelParts = ['footer', `slot-${index + 1}`, post.source];

        track({
          action: trackActions.click,
          category: 'recirculation',
          label: labelParts.join('='),
        });

        run.later(() => {
          window.location.assign(post.url);
        }, 200);
      },

      articleClick(title, index) {
        track({
          action: trackActions.click,
          category: 'recirculation',
          label: `more-wiki-${index}`,
        });

        this.router.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(title)));
      },
    },

    fetchTopArticles() {
      const url = this.wikiUrls.build({
        host: this.get('wikiVariables.host'),
        forceNoSSLOnServerSide: true,
        path: '/wikia.php',
        query: {
          controller: 'RecirculationApiController',
          method: 'getPopularWikiArticles',
        },
      });
      this.fetch.fetchFromMediawiki(url, TopArticlesFetchError)
        .then(data => this.set('topArticles', data))
        .catch((error) => {
          this.logger.error(error.message);
          this.set('topArticles', []);
        });
    },

    fetchLiftIgniterData() {
      const liftigniter = this.wdsLiftigniter;

      liftigniter
        .getData(config)
        .then((data) => {
          this.set('items', data.items.filter(item => item.thumbnail)
            .slice(0, recircItemsCount)
            .map((item) => {
              item.thumbnail = Thumbnailer.getThumbURL(item.thumbnail, {
                mode: Thumbnailer.mode.scaleToWidth,
                width: normalizeThumbWidth(window.innerWidth),
              });

              return item;
            }));

          run.scheduleOnce('afterRender', () => {
            if (!this.isDestroyed) {
              liftigniter.setupTracking(
                this.element.querySelectorAll('.recirculation-prefooter__item'),
                config.widget,
                'LI',
              );
              this.listRendered.resolve();
            }
          });
        });

      track({
        action: trackActions.impression,
        category: 'recirculation',
        label: 'footer',
      });
    },

    didEnterViewport() {
      if (this.applicationWrapperVisible) {
        this.fetchTopArticles();
        this.sponsoredContent.fetchData();
      }

      if (M.getFromHeadDataStore('noExternals')) {
        this.listRendered.resolve();
        return;
      }

      M.trackingQueue.push((isOptedIn) => {
        if (isOptedIn && this.displayLiftigniterRecirculation) {
          this.fetchLiftIgniterData();
        } else {
          this.listRendered.resolve();
        }
      });
    },
  },
);
