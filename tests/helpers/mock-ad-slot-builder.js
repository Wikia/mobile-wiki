import sinon from 'sinon';
import Service from '@ember/service';

export function mockAdSlotBuilder(owner) {
  owner.register('service:ads/ad-slot-builder', Service.extend({
    init() {
      this._super(...arguments);
    },

    injectAds: sinon.spy(),

    injectSearchPageTopLeaderboard: sinon.spy(),

    injectMainPageAds: sinon.spy(),
  }));
}

export default mockAdSlotBuilder;
