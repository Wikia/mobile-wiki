import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import { mockAdSlotBuilder } from '../../../helpers/mock-ad-slot-builder';
import { getAdsModuleMock } from '../../../helpers/mock-ads-service';

module('Unit | Component | ads | search top leaderboard', (hooks) => {
  setupTest(hooks);
  let adsModuleStub;

  hooks.beforeEach(function () {
    mockAdSlotBuilder(this.owner);
    adsModuleStub = sinon.stub(Ads, 'getLoadedInstance').returns(Promise.resolve(getAdsModuleMock()));


    this.adSlotBuilder = this.owner.lookup('service:ads/ad-slot-builder');
    this.component = this.owner.factoryFor('component:ads/search-top-leaderboard')
      .create();
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
  });

  test('should render ad', function (assert) {
    const done = assert.async();

    this.component.didInsertElement();
    setTimeout(() => {
      assert.ok(this.adSlotBuilder.injectSearchPageTopLeaderboard.calledOnceWith(this.component));
      done();
    });
  });
});
