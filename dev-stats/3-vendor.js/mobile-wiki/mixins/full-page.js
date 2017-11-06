define('mobile-wiki/mixins/full-page', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Mixin.create({
		/**
   * @returns {void}
   */
		activate: function activate() {
			this.controllerFor('application').set('fullPage', true);
		},


		/**
   * @returns {void}
   */
		deactivate: function deactivate() {
			this.controllerFor('application').set('fullPage', false);
		}
	});
});