define('mobile-wiki/components/wikia-ui-components/wikia-card-list', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['wikia-card-list'],
		tagName: 'ul'
	});
});