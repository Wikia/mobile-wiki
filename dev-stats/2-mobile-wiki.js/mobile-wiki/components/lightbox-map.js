define('mobile-wiki/components/lightbox-map', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['lightbox-map', 'lightbox-content-inner'],

		modelObserver: Ember.observer('model', function () {
			this.updateState();
		}),

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var _this = this;

			// this.updateState modifies header and footer rendered in LightboxWrapperComponent
			// This isn't allowed by Ember to do on didInsertElement
			// That's why we need to schedule it in the afterRender queue
			Ember.run.scheduleOnce('afterRender', this, function () {
				_this.updateState();
			});
		},


		/**
   * @returns {void}
   */
		updateState: function updateState() {
			var model = this.get('model');

			this.sendAction('setHeader', model.title);
			this.sendAction('setQueryParam', 'map', model.id);
		}
	});
});