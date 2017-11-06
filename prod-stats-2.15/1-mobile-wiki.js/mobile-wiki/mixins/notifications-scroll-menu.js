define('mobile-wiki/mixins/notifications-scroll-menu', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin,
	    on = Ember.on,
	    run = Ember.run;
	exports.default = Mixin.create({
		classNames: ['notifications-scroll-menu'],
		classNameBindings: ['isLoadingNewResults'],
		scrollableElement: '.scrolling-part',
		almostBottom: 100,

		bindScrollObserver: on('didRender', function () {
			var _this = this;

			run.later(function () {
				_this.$(_this.get('scrollableElement')).on('scroll', _this.onScroll.bind(_this));
				_this.$(_this.get('scrollableElement')).on('mousewheel DOMMouseScroll', _this.onMouseWheel);
			}, 0);
		}),

		onScrollRemover: on('willDestroyElement', function () {
			this.$(this.get('scrollableElement')).off('scroll', this.onScroll.bind(this));
		}),

		onScroll: function onScroll(event) {
			var target = $(event.target);

			if (this.hasAlmostScrolledToTheBottom(target)) {
				this.get('notifications').loadNextPage();
			}
		},
		onMouseWheel: function onMouseWheel(e) {
			var delta = -e.originalEvent.wheelDelta || e.originalEvent.detail,
			    scrollTop = this.scrollTop;
			if (delta < 0 && scrollTop === 0 || delta > 0 && this.scrollHeight - this.clientHeight - scrollTop === 0) {
				e.preventDefault();
			}
		},


		/**
   * Has the user scrolled almost to the bottom?
   * @private
   */
		hasAlmostScrolledToTheBottom: function hasAlmostScrolledToTheBottom(element) {
			return element[0].scrollHeight - this.get('almostBottom') <= element.scrollTop() + element.innerHeight();
		}
	});
});