/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/articleLink.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend(Em.TargetActionSupport, {
	model: function <T>(params: T): T {
		return params;
	},

	actions: {
		loading: function (): void {
			this.controller.showLoader();
		},
		didTransition: function () {
			this.controller.hideLoader();
		},
		error: function () {
			this.controller.hideLoader();
		},
		handleLink: function (target: HTMLAnchorElement): void {
			var controller = this.controllerFor('article'),
				model = controller.get('model'),
				trackingCategory = target.dataset.trackingCategory,
				info = M.getLinkInfo(model.get('basePath'),
					model.get('title'),
					target.hash,
					target.href
				);

			/**
			 * Handle tracking
			 */
			if (trackingCategory) {
				this.triggerAction({
					action: 'trackClick',
					target: this,
					actionContext: trackingCategory
				});
			}

			/**
			 * handle links that are external to the application like ?useskin=oasis
			 */
			if (target.className.indexOf('external') > -1) {
				if (target.href.indexOf('useskin=oasis') > -1) {
					// If using Oasis skin, remove Mercury cookie
					document.cookie = 'useskin=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
				}
				return window.location.assign(target.href);
			}

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
			this.get('controller').set('sideNavCollapsed', false);
		},

		collapseSideNav: function (): void {
			this.get('controller').set('sideNavCollapsed', true);
		},

		trackClick: function (category: string, label: string = ''): void {
			M.track({
				action: M.trackActions.click,
				category: category,
				label: label
			});
		}
	}
});
