define('mobile-wiki/components/widget-playbuzz', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['widget-playbuzz'],
		data: null,

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			$script('https://cdn.playbuzz.com/widget/feed.js');
		}
	});
});