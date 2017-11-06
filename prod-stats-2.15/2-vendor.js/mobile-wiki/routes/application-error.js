define('mobile-wiki/routes/application-error', ['exports', 'mobile-wiki/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Route = Ember.Route;
	exports.default = Route.extend({
		renderTemplate: function renderTemplate() {
			if (_environment.default.wikiaEnv === 'dev') {
				this.render('errors/application-dev');
			} else {
				this.render('errors/application');
			}
		},


		actions: {
			reloadPage: function reloadPage() {
				window.location.reload();
			}
		}
	});
});