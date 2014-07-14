/// <reference path="../app.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend({
	model: function <T>(params: T): T {
		return params;
	},
	actions: {
		loading () {
			var controller = this.controllerFor('application'),
				spinner;

			spinner = App.LoadingSpinnerComponent.create({
				animSpeed: controller.get('globalAnimSpeed')
			}).append();

			controller.set('spinnerView', spinner);
		},
		didTransition () {
			var spinnerView = this.controllerFor('application').get('spinnerView');
			if (spinnerView) {
				spinnerView.destroy();
			}
		}
	}
});
