import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';
import { v4 as uuid } from 'ember-uuid';

import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import SearchModel from '../models/search';
import closedWikiHandler from '../utils/closed-wiki-handler';
import emptyDomainWithLanguageWikisHandler from '../utils/empty-domain-with-language-wikis-handler';
import {
  track,
  trackActions,
  trackPageView,
  setTrackContext,
} from '../utils/track';
import Ads from '../modules/ads';

export default Route.extend(
  ApplicationWrapperClassNamesMixin,
  HeadTagsDynamicMixin,
  {
    ads: service('ads/ads'),
    adsContextService: service('ads/search-page-ads-context'),
    i18n: service(),
    initialPageView: service(),
    fastboot: service(),
    runtimeConfig: service(),

    queryParams: {
      query: {
        refreshModel: true,
      },
      scope: {
        refreshModel: true,
      },
      debugAffiliateUnits: {
        refreshModel: true,
      },
    },

    applicationWrapperClassNames: null,
    transitionQueryParams: null,

    init() {
      this._super(...arguments);
    },

    beforeModel() {
      this._super(...arguments);
      closedWikiHandler(this.wikiVariables);
      emptyDomainWithLanguageWikisHandler(this.fastboot, this.wikiVariables);
      this.applicationWrapperClassNames = ['search-result-page'];
    },

    model(params, transition) {
      if (this.get('fastboot.isFastBoot')) {
        // First pageview is tracked from outside of Ember and it will only be tracked
        // if the trackingData for the page is set in shoebox (nulls are default values as search
        // page does not have an ID or a namespace in mobile-wiki)
        this.get('fastboot.shoebox').put('trackingData', {
          articleId: null,
          namespace: null,
        });
      }

      this.transitionQueryParams = transition.queryParams;

      return SearchModel
        .create(getOwner(this).ownerInjection())
        .search(
          params.query,
          params.scope,
          params.debugAffiliateUnits ? params.debugAffiliateUnits : false,
        );
    },

    actions: {
      /**
       * @returns {void}
       */
      willTransition() {
        this.ads.beforeTransition();
      },

      /**
       * @returns {boolean}
       */
      didTransition() {
        scheduleOnce('afterRender', this, this.onAfterRender);

        this.adsContextService.getAdsContext()
          .then((adsContext) => {
            const ads = Ads.getInstance();

            window.getInstantGlobals((instantGlobals) => {
              if (ads.isInitializationStarted) {
                Ads.getLoadedInstance().then(() => {
                  ads.afterTransition(adsContext);
                });
              } else {
                ads.init(instantGlobals, adsContext, this.transitionQueryParams);
              }
            });
          });

        return true;
      },
    },

    onAfterRender() {
      const controller = this.controllerFor('search');

      // Reset article id and namespace to null when navigating from article page
      setTrackContext({
        a: null,
        n: null,
      });

      trackPageView(this.initialPageView.isInitialPageView());

      track({
        action: trackActions.impression,
        category: 'app',
        label: 'search',
      });

      controller.searchId = uuid();
      controller.trackResultsImpression();
    },

    setDynamicHeadTags(model) {
      const data = {
        htmlTitle: this.i18n.t('main.search-input-label', { ns: 'search' }),
        robots: 'noindex,follow',
      };

      this._super(model, data);
    },
  },
);
