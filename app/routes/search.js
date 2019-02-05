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
      closedWikiHandler(this.wikiVariables);
      emptyDomainWithLanguageWikisHandler(this.fastboot, this.wikiVariables);
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
          const controller = this.controllerFor('search');

          trackPageView(this.initialPageView.isInitialPageView());

          track({
            action: trackActions.impression,
            category: 'app',
            label: 'search',
          });

          controller.searchId = uuid();
          controller.trackResultsImpression();
        });
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
