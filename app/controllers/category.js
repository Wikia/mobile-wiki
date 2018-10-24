import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { Promise } from 'rsvp';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(
  WikiPageControllerMixin,
  {
    article: controller(),
    application: controller(),
    wikiPage: controller(),
    preserveScroll: service(),

    actions: {
      /**
       * @param {number} from
       * @returns {Promise}
       */
      loadFrom(from) {
        return this.model.loadFrom(from)
          .then(() => {
            this.set('preserveScroll.preserveScrollPosition', true);
            this.wikiPage.set('from', from);
            this.target.send('updateDynamicHeadTags');
          });
      },
    },
  },
);
