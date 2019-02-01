import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

const adsStub = Service.extend({
  module: (function () {
    return {
      afterTransition: () => {
      },
    };
  }()),
});

module('Unit | Service | ad-slot-builder', (hooks) => {
  setupTest(hooks);

  test('setup ads context', function (assert) {
    this.owner.register('service:ads/ads', adsStub);
    this.ads = this.owner.lookup('service:ads/ads');
    this.service = this.owner.lookup('service:ads/ad-slot-builder');

    const context = {
      a: 1,
    };
    const reloadSpy = sinon.spy(this.service.get('ads.module'), 'afterTransition');

    this.service.setupAdsContext(context);

    assert.ok(reloadSpy.calledWith(context), 'Set the ads context');
  });
});
