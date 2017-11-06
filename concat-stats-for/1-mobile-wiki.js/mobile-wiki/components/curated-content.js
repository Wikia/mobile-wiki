define('mobile-wiki/components/curated-content', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	var $ = Ember.$;
	exports.default = Component.extend({
		classNames: ['curated-content', 'mw-content'],
		activeLabel: null,

		actions: {
			/**
    * @param {CuratedContentItem} item
    * @returns {void}
    */
			openSection: function openSection(item) {
				var navHeight = $('.site-head-container').outerHeight(),
				    scrollTop = this.$().offset().top - navHeight;

				this.set('activeLabel', item.label);
				$('html, body').animate({ scrollTop: scrollTop });
			},
			closeSection: function closeSection() {
				this.set('activeLabel', null);
			}
		}
	});
});