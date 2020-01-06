import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
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

    /**
     * @param {number} from
     * @returns {Promise}
     */
    @action
    loadFrom(from) {
      return this.model.loadFrom(from)
        .then(() => {
          this.set('preserveScroll.preserveScrollPosition', true);
          this.wikiPage.set('from', from);
          this.target.send('updateDynamicHeadTags');
        });
    },
  },
);
