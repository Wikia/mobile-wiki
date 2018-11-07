import Controller, { inject as controller } from '@ember/controller';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import WikiPageControllerMixin from '../mixins/wiki-page-controller';

export default Controller.extend(
  WikiPageControllerMixin,
  {
    article: controller(),
    application: controller(),
    wikiPage: controller(),
    preserveScroll: service(),

    from: readOnly('wikiPage.from'),

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
