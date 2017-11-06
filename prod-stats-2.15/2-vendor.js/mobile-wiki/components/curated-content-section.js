define('mobile-wiki/components/curated-content-section', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['curated-content-section'],
		classNameBindings: ['shouldBeVisible::hidden']
	});
});