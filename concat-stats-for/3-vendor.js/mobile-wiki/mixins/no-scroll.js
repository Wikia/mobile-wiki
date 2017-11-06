define('mobile-wiki/mixins/no-scroll', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin,
	    observer = Ember.observer,
	    $ = Ember.$;


	// singleton for no scroll state shared across all mixin usages
	var NoScrollState = Ember.Object.extend().reopenClass({ state: false });

	exports.default = Mixin.create({
		// global state
		noScrollState: NoScrollState,
		// current component state
		noScroll: false,

		noScrollObserver: observer('noScroll', function () {
			this.setNoScroll(this.get('noScroll'));
		}),

		init: function init() {
			this._super.apply(this, arguments);
			// initialise with value
			this.setNoScroll(this.get('noScroll'));
		},
		willDestroyElement: function willDestroyElement() {
			this._super.apply(this, arguments);
			// turn off scroll on destroy
			this.setNoScroll(false);
		},
		setNoScroll: function setNoScroll(current) {
			if (!window.location) {
				return;
			}

			var $body = $('body');

			if (this.get('noScrollState.state') && current) {
				throw Error('No-scroll already applied, turn it off first');
			}
			this.set('noScrollState.state', current);

			if (current) {
				$body.addClass('no-scroll');
			} else {
				$body.removeClass('no-scroll');
			}
		}
	});
});