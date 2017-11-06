define('mobile-wiki/initializers/ember-hammer', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;
	/**
  * Initializer for Ember Hammer
  *
  * @returns {void}
  */
	function initialize() {
		if (typeof FastBoot !== 'undefined') {
			return;
		}

		window.emberHammerOptions = {
			hammerOptions: {
				// we are using fastclick as this is advised by ember-hammer lib
				ignoreEvents: [],
				swipe_velocity: 0.1,
				pan_threshold: 1
			}
		};
	}

	exports.default = {
		name: 'ember-hammer',
		initialize: initialize
	};
});