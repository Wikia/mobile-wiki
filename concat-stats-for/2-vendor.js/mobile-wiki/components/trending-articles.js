define('mobile-wiki/components/trending-articles', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['trending', 'trending-articles', 'mw-content']
	});
});