export function initialize() {
	window.emberHammerOptions = {
		hammerOptions: {
			// we are using fastclick as this is advised by ember-hammer lib
			ignoreEvents: [],
			swipe_velocity: 0.1,
			pan_threshold: 1
		}
	};
}

export default {
	name: 'ember-hammer',
	initialize
};
