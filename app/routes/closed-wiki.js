import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';

export default Route.extend(
  HeadTagsDynamicMixin,
  {
    fastboot: service(),

    activate() {
      if (this.fastboot.isFastBoot) {
        this.fastboot.set('response.statusCode', 410);
      }

      this.setDynamicHeadTags({}, {
        htmlTitle: 'Closed Wiki',
        robots: 'noindex,nofollow',
      });
    },
  },
);
