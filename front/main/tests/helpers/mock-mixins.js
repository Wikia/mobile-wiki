import Ember from 'ember';

/**
 * This file exists because we currently don't know how to restore mocked modules to the original state
 * so it affects the global state and is used for all tests
 *
 * @todo XW-1235: do it properly
 */
export function mockTrackClickMixin() {
	require.entries['main/mixins/track-click'].callback = () => {
		return Ember.Mixin.create({
			actions: {
				trackClick: Ember.K
			},

			trackClick: Ember.K
		});
	};
}
