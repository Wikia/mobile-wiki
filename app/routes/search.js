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
    initialPageView: service(),
    i18n: service(),

    queryParams: {
      query: {
        refreshModel: true,
      },
    },

    applicationWrapperClassNames: null,

    init() {
      this._super(...arguments);
      this.applicationWrapperClassNames = ['search-result-page'];
    },

    beforeModel() {
      this._super(...arguments);
      emptyDomainWithLanguageWikisHandler(this.fastboot, this.wikiVariables);
      closedWikiHandler(this.wikiVariables);
    },

    model(params) {
      return SearchModel
        .create(getOwner(this).ownerInjection())
        .search(params.query);
    },

    actions: {
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

        return true;
      },
    },

    setDynamicHeadTags(model) {
      const data = {
        htmlTitle: this.i18n.t('main.search-input-label', { ns: 'search' }),
      };

      this._super(model, data);
    },
  },
);
