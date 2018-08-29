import { module, test } from 'qunit';
import sinon from 'sinon';
import SlotTracker from 'mobile-wiki/modules/ads/tracking/slot-tracker';

module('Unit | Module | ads | tracking', (hooks) => {
  hooks.beforeEach(() => {
    window.Wikia.adEngine = {
      context: {
        get: () => true,
      },
    };
    window.Wikia.adProducts = {
      bidders: {
        getCurrentSlotPrices: () => {},
        getDfpSlotPrices: () => {},
      },
      utils: {
        getCountryCode: () => {},
        getSamplingResults: () => [],
      },
    };
    sinon.spy(M.tracker.Internal, 'track');
  });

  hooks.afterEach(() => {
    M.tracker.Internal.track.restore();
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
    assert.equal(M.tracker.Internal.track.getCall(0).args[1].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct pos value for multi pos value', (assert) => {
    const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD,TEST_EXTRA_POS' });

    SlotTracker.onRenderEnded(adSlot, {});
    assert.equal(M.tracker.Internal.track.getCall(0).args[1].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct opt-in value', (assert) => {
    const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD' });

    SlotTracker.onRenderEnded(adSlot, {});
    assert.equal(M.tracker.Internal.track.getCall(0).args[1].opt_in, 'yes');
  });
});
