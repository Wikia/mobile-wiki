import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and } from '@ember/object/computed';

export default Component.extend({
  affiliateSlots: service(),

  bigUnit: null,
  isBigFinished: false,
  smallUnit: null,
  isSmallFinished: false,
  debugAffiliateUnits: false,

  isEnabled: and('isBigFinished', 'isSmallFinished'),

  init() {
    this._super(...arguments);


    this.affiliateSlots.fetchUnitForSearch(this.query, false, this.debugAffiliateUnits)
      .then((unit) => {
        this.set('smallUnit', unit);
        this.set('isSmallFinished', true);
      });

    this.affiliateSlots.fetchUnitForSearch(this.query, true, this.debugAffiliateUnits)
      .then((unit) => {
        this.set('bigUnit', unit);
        this.set('isBigFinished', true);
      });
  },
});
