define('mobile-wiki/components/article-edit', ['exports', 'mobile-wiki/mixins/viewport'], function (exports, _viewport) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = Ember.$;
	var on = Ember.on;
	var observer = Ember.observer;
	var Component = Ember.Component;
	exports.default = Component.extend(_viewport.default, {
		classNames: ['article-edit'],

		viewportHeightObserver: observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: on('didInsertElement', function () {
			$('textarea').css('height', $(window).height() - $('.sub-head').outerHeight());
		}),

		actions: {
			/**
    * @returns {void}
    */
			back: function back() {
				this.sendAction('back');
			},


			/**
    * @returns {void}
    */
			publish: function publish() {
				this.sendAction('publish');
			}
		}
	});
});