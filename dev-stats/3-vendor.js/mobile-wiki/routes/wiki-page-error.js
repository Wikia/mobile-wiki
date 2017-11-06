define('mobile-wiki/routes/wiki-page-error', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Route = Ember.Route;
	exports.default = Route.extend({
		/**
   * @param {Ember.Controller} controller
   * @param {EmberError} error
   * @returns {void}
   */
		renderTemplate: function renderTemplate(controller, error) {
			switch (error.code) {
				case 404:
					this.render('errors/not-found');
					break;
				default:
					this.render('errors/other');
					break;
			}
		},


		actions: {
			/**
    * @returns {void}
    */
			reloadPage: function reloadPage() {
				window.location.reload();
			}
		}
	});
});