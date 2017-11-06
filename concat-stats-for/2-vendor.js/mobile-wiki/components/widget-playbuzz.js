define('mobile-wiki/components/widget-playbuzz', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
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