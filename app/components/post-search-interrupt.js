import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';

export default Component.extend({
  affiliateSlots: service(),

  bigUnit: null,
  isBigFinished: false,
  smallUnit: null,
  isSmallFinished: false,

  isEnabled: and('isBigFinished', 'isSmallFinished'),
  debugAffiliateUnits: false,

  init() {
    this._super(...arguments);


    this.affiliateSlots.fetchUnitForSearch(this.query, false, this.debugAffiliateUnits).then(u => {
      this.set('smallUnit', u);
      this.set('isSmallFinished', true);
    });

    this.affiliateSlots.fetchUnitForSearch(this.query, true, this.debugAffiliateUnits).then(u => {
      this.set('bigUnit', u);
      this.set('isBigFinished', true);
    });
  },
});
