import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  affiliateSlots: service(),

  bigUnit: null,
  isEnabled: false,
  smallUnit: null,
  debugAffiliateUnits: false,

  didInsertElement() {
    this._super(...arguments);

    this.affiliateSlots.fetchUnitsForSearch(this.query, this.debugAffiliateUnits)
      .then((units) => {
        this.set('smallUnit', units.small);
        this.set('bigUnit', units.big);
        this.set('isEnabled', true);
      });
  },
});
