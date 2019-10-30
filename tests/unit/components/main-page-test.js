import Component from '@ember/component';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import { mockAdsService } from '../../helpers/mock-ads-service';
import { mockAdSlotBuilder } from '../../helpers/mock-ad-slot-builder';

const trackModule = require('mobile-wiki/utils/track');
const adSlotComponentStub = Component.extend({});
let setTrackContextStub;
let trackPageViewStub;


module('Unit | Component | main page', (hooks) => {
  setupTest(hooks);
  let adsModuleStub;

  hooks.beforeEach(function () {
    // no idea why it does not work with returning Promise.resolve(getAdsModuleMock())
    adsModuleStub = sinon.stub(Ads, 'getLoadedInstance').returns({
      then: (cb) => {
        cb();
        return { catch: () => {} };
      },
    });
    setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
    trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
    this.owner.register('component:ad-slot', adSlotComponentStub);
    mockAdSlotBuilder(this.owner);
    mockAdsService(this.owner);
  });

  hooks.afterEach(() => {
    setTrackContextStub.restore();
    trackPageViewStub.restore();
    adsModuleStub.restore();
  });

  test('injects ads', function (assert) {
    const adsService = this.owner.lookup('service:ads/ads');
    const adsContext = {
      valid: true,
    };
    setTrackContextStub = sinon.stub(adsService, 'setupAdsContext');

    const component = this.owner.factoryFor('component:main-page').create({
      adsContext,
    });

    run(() => {
      component.didInsertElement();
    });

    assert.ok(adsService.setupAdsContext.calledOnce, 'setupAdsContextSpy called');
    assert.ok(adsService.setupAdsContext.calledWith(adsContext), 'setupAdsContextSpy called with ads context');
    assert.ok(component.adSlotBuilder.injectMainPageAds.calledOnce, 'injectMainPageAds called');
  });
});
