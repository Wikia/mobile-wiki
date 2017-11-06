define('mobile-wiki/components/article-edit', ['exports', 'mobile-wiki/mixins/viewport'], function (exports, _viewport) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, {
		classNames: ['article-edit'],

		viewportHeightObserver: Ember.observer('viewportDimensions.height', function () {
			this.adjustTextareaHeight();
		}),

		adjustTextareaHeight: Ember.on('didInsertElement', function () {
			Ember.$('textarea').css('height', Ember.$(window).height() - Ember.$('.sub-head').outerHeight());
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