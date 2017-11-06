define('mobile-wiki/components/wikia-drawer', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		tagName: 'nav',
		classNameBindings: ['shouldBeVisible:slide-into-view:collapsed']
	});
});