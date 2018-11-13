import Route from '@ember/routing/route';

import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Route.extend(
  HeadTagsDynamicMixin,
  {
    setDynamicHeadTags(model) {
      const data = {
        robots: 'noindex,follow'
      };

      this._super(model, data);
    },
  },
);
