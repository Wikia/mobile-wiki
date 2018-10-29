import { module, test } from 'qunit';
import sinon from 'sinon';
import SlotTracker from 'mobile-wiki/modules/ads/tracking/slot-tracker';
import trackModule from 'mobile-wiki/utils/track';

module('Unit | Module | ads | tracking', (hooks) => {
  hooks.beforeEach(() => {
    window.Wikia.adEngine = {
      context: {
        get: () => true,
      },
      utils: {
        getCountryCode: () => {},
        getSamplingResults: () => [],
      },
    };
    window.Wikia.adBidders = {
      bidders: {
        getCurrentSlotPrices: () => {},
        getDfpSlotPrices: () => {},
      },
    };
    window.Wikia.adServices = {
      billTheLizard: {
        serialize: () => '',
      },
    };
    sinon.spy(trackModule, 'track');
  });

  hooks.afterEach(() => {
    trackModule.track.restore();
  });

  function getSlot(targeting) {
    return {
      getSlotName: () => 'BOTTOM_LEADERBOARD',
      getStatus: () => 'success',
      getTargeting: () => (targeting),
    };
  }

  test('tracker send correct pos value', (assert) => {
    const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD' });

    SlotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct pos value for multi pos value', (assert) => {
    const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD,TEST_EXTRA_POS' });

    SlotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct opt-in value', (assert) => {
    const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD' });

    SlotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].opt_in, 'yes');
  });
});
