/// <reference path="../app.ts" />
/// <reference path="../../wikia/utils/articleLink.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend({
	model: function <T>(params: T): T {
		return params;
	},

	actions: {
		loading: function () {
			this.set('loadingView', this.container.lookup('view:loading').append());
		},
		didTransition: function () {
			if (this.get('loadingView')) {
				this.get('loadingView').destroy();
			}
		},
		handleLink: function (target: HTMLAnchorElement) {
			var controller = this.controllerFor('article'),
				model = controller.get('model'),
				info = Wikia.Utils.getLinkInfo(model.get('basePath'),
					model.get('title'),
					target.hash,
					target.href
				);

			if (info.article) {
				if (info.hash) {
					App.set('hash', info.hash);
				}
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
				Em.Logger.error('unable to open link', target.href);
			}
		},

		openLightbox: function (lightboxName: string, data?: any): void {
			if (data) {
				this.controllerFor(lightboxName).set('data', data);
			}

			return this.render(lightboxName, {
				into: 'application',
				outlet: 'lightbox'
			});
		},

		closeLightbox: function (): void {
			return this.disconnectOutlet({
				outlet: 'lightbox',
				parentView: 'application'
			});
		},

		expandSideNav: function (): void {
			this.controllerFor('sideNav').send('expand');
		},

		collapseSideNav: function (): void {
			this.controllerFor('sideNav').send('collapse');
		}
	}
});
