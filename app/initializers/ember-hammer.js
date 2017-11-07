/**
 * Initializer for Ember Hammer
 *
 * @returns {void}
 */
export function initialize() {
	if (typeof FastBoot !== 'undefined') {
		return;
	}

	window.emberHammerOptions = {
		hammerOptions: {
			swipe_velocity: 0.1,
			pan_threshold: 1
		}
	};
}

export default {
	name: 'ember-hammer',
	initialize
};
