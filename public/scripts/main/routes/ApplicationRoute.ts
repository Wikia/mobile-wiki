/// <reference path="../app.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend({
	model: function <T>(params: T): T {
		return params;
	},
	actions: {
		loading: function () {
			var controller = this.controllerFor('application'),
				spinner;

			spinner = App.LoadingSpinnerComponent.create({
				animSpeed: controller.get('globalAnimSpeed')
			}).append();

			controller.set('spinnerView', spinner);
		},
		didTransition: function () {
			var spinnerView = this.controllerFor('application').get('spinnerView');
			if (spinnerView) {
				spinnerView.destroy();
			}
		},
		handleLink: function (target) {
			var controller = this.controllerFor('article'),
				model = controller.get('model'),
				info = W.getLinkInfo(model.get('basepath'),
						model.get('title'),
						target.hash,
						target.href);

			if (info.article) {
				controller.send('changePage', info.article);
			} else if (info.url) {
				/**
				 * If it's a jump link or a link to something in a Wikia domain, treat it like a normal link
				 * so that it will replace whatever is currently in the window.
				 * TODO: this regex is alright for dev environment, but doesn't work well with production
				 */
				if (info.url.charAt(0) === '#' || info.url.match(/^https?:\/\/.*\.wikia(\-.*)?\.com.*\/.*$/)) {
					window.location.assign(info.url);
				} else {
					window.open(info.url);
				}
			} else {
				// Reaching this clause means something is probably wrong.
				console.log('unable to open link "' + target.href + '"');
			}
		}
	}
});
