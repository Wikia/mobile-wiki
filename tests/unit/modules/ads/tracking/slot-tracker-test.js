import { module, test } from 'qunit';
import sinon from 'sinon';
import { slotTracker, onRenderEndedStatusToTrack } from 'mobile-wiki/modules/ads/tracking/slot-tracker';
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
        getDocumentVisibilityStatus: () => 'visible',
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

  function getSlot({ targeting, config = {}, status }) {
    return {
      getSlotName: () => 'BOTTOM_LEADERBOARD',
      getStatus: () => status || 'success',
      getTargeting: () => targeting,
      targeting,
      getConfigProperty: prop => config[prop],
    };
  }

  test('tracker send correct pos value', (assert) => {
    const adSlot = getSlot({ targeting: { pos: 'BOTTOM_LEADERBOARD' } });

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct pos value for multi pos value', (assert) => {
    const adSlot = getSlot({ targeting: { pos: 'BOTTOM_LEADERBOARD,TEST_EXTRA_POS' } });

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].kv_pos, 'bottom_leaderboard');
  });

  test('tracker send correct opt-in value', (assert) => {
    const adSlot = getSlot({ targeting: { pos: 'BOTTOM_LEADERBOARD' } });

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].opt_in, 'yes');
  });

  test('tracker sends correct document_visible value', (assert) => {
    const adSlot = getSlot({ targeting: { pos: 'BOTTOM_LEADERBOARD' } });

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].document_visibility, 'visible');
  });

  test('onRenderEnded does not call track if adSlot does not have config property trackEachStatus and is not in onRenderEndedStatusToTrack', (assert) => {
    const status = 'not-really-a-status';
    const adSlot = getSlot({
      config: {},
      status,
      targeting: { pos: 'FEATURED' },
    });

    assert.equal(onRenderEndedStatusToTrack.indexOf(status), -1);

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.called, false);
  });

  test('onRenderEnded calls track if adSlot has config property trackEachStatus and is not in onRenderEndedStatusToTrack', (assert) => {
    const status = 'not-really-a-status';
    const adSlot = getSlot({
      config: {
        trackEachStatus: true,
      },
      status,
      targeting: { pos: 'FEATURED' },
    });

    assert.equal(onRenderEndedStatusToTrack.indexOf(status), -1);

    slotTracker.onRenderEnded(adSlot, {});
    assert.equal(trackModule.track.getCall(0).args[0].document_visibility, 'visible');
  });
});
