import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';
import SlotTracker from 'mobile-wiki/modules/ads/tracking/slot-tracker';

module('Unit | Module | ads | tracking', (hooks) => {

	hooks.beforeEach(() => {
		sinon.spy(M.tracker.Internal, 'track');
	});

	hooks.afterEach(() => {
		M.tracker.Internal.track.restore();
	});

	function getSlot(targeting) {
		return {
			getStatus: () => 'success',
			getTargeting: () => (targeting)
		};
	}

	test('tracker send correct pos value', (assert) => {
		const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD' });

		SlotTracker.onRenderEnded(adSlot, {});
		assert.equal(M.tracker.Internal.track.getCall(0).args[1].kv_pos, 'BOTTOM_LEADERBOARD');
	});

	test('tracker send correct pos value for multi pos value', (assert) => {
		const adSlot = getSlot({ pos: 'BOTTOM_LEADERBOARD,TEST_EXTRA_POS' });

		SlotTracker.onRenderEnded(adSlot, {});
		assert.equal(M.tracker.Internal.track.getCall(0).args[1].kv_pos, 'BOTTOM_LEADERBOARD');
	});
});
