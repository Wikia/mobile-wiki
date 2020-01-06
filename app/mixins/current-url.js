import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  routing: service('-routing'),
  wikiUrls: service(),
  wikiVariables: service(),

  currentURL: computed('routing.router.currentURL', function () {
    return this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      path: this.get('routing.router.currentURL'),
    });
  }),
});
