import Component from '@ember/component';
import Service from '@ember/service';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import { getAdsModuleMock } from '../../helpers/mock-ads-service';

const trackModule = require('mobile-wiki/utils/track');
const adSlotComponentStub = Component.extend({});
const adSlotBuilderStub = Service.extend({
  initialize() {},
  injectMainPageAds: sinon.spy(),
  setupAdsContext: sinon.spy(),
});
let setTrackContextStub;
let trackPageViewStub;


module('Unit | Component | main page', (hooks) => {
  setupTest(hooks);
  let adsModuleStub;

  hooks.beforeEach(function () {
    adsModuleStub = sinon.stub(Ads, 'waitForAdEngine').returns({ then: cb => cb(getAdsModuleMock()) });
    setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
    trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
    this.owner.register('component:ad-slot', adSlotComponentStub);
    this.owner.register('service:ads/ad-slot-builder', adSlotBuilderStub);
  });

  hooks.afterEach(() => {
    setTrackContextStub.restore();
    trackPageViewStub.restore();
    adsModuleStub.restore();
  });

  test('injects ads', function (assert) {
    const adsContext = {
      valid: true,
    };
    const component = this.owner.factoryFor('component:main-page').create({
      adsContext,
    });

    component.get('ads.module').isLoaded = true;
    run(() => {
      component.didInsertElement();
    });

    assert.ok(component.adSlotBuilder.setupAdsContext.calledOnce, 'setupAdsContextSpy called');
    assert.ok(component.adSlotBuilder.setupAdsContext.calledWith(adsContext), 'setupAdsContextSpy called with ads context');
    assert.ok(component.adSlotBuilder.injectMainPageAds.calledOnce, 'injectMainPageAds called');
  });
});
