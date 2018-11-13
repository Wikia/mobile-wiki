import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Route.extend(
  HeadTagsDynamicMixin,
  {
    wikiVariables: service(),

    beforeModel() {
      if (!this.wikiVariables.languageWikis) {
        this.fastboot.set('response.statusCode', 301);
        this.get('fastboot.response.headers').set(
          'location',
          this.get('wikiVariables.basePath')
          + this.get('wikiVariables.articlePath')
          + encodeURIComponent(this.get('wikiVariables.mainPageTitle')),
        );
      }
    },

    setDynamicHeadTags(model) {
      const data = {
        robots: 'noindex,follow'
      };

      this._super(model, data);
    },
  },
);
