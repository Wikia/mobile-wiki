import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  affiliateSlots: service(),

  affiliateUnit: computed('query', function () {
    return this.affiliateSlots.getBigUnitOnSearch(this.get('query'));
  }),
});
