import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';
import { scheduleOnce } from '@ember/runloop';

import ApplicationWrapperClassNamesMixin from '../mixins/application-wrapper-class-names';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import SearchModel from '../models/search';
import closedWikiHandler from '../utils/closed-wiki-handler';
import emptyDomainWithLanguageWikisHandler from '../utils/empty-domain-with-language-wikis-handler';
import { track, trackActions, trackPageView } from '../utils/track';

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
    },

    applicationWrapperClassNames: null,

    init() {
      this._super(...arguments);
    },

    beforeModel() {
      this._super(...arguments);
      closedWikiHandler(this.wikiVariables);
      emptyDomainWithLanguageWikisHandler(this.fastboot, this.wikiVariables);
      this.applicationWrapperClassNames = ['search-result-page'];
    },

    model(params) {
      if (this.get('fastboot.isFastBoot')) {
        this.get('fastboot.shoebox').put('trackingData', {
          articleId: null,
          namespace: null,
        });
      }

      return SearchModel
        .create(getOwner(this).ownerInjection())
        .search(params.query);
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
        scheduleOnce('afterRender', this, () => {
          trackPageView(this.initialPageView.isInitialPageView());

          track({
            action: trackActions.impression,
            category: 'app',
            label: 'search',
          });
        });

        if (!this.get('fastboot.isFastBoot')) {
          this.adsContextService.getAdsContext()
            .then((adsContext) => {
              if (this.get('ads.module.isLoaded')) {
                this.ads.setupAdsContext(adsContext);
              } else {
                this.ads.module.init(adsContext);
              }
            });
        }

        return true;
      },
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
