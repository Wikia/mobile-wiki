/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../mercury/utils/articleLink.ts" />
/// <reference path="../../mercury/utils/variantTesting.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend(Em.TargetActionSupport, {
	model: function <T>(params: T): T {
		return params;
	},

	activate: function (): void {
		/**
		 * This global function is being used by our AdEngine code to provide prestitial/interstitial ads
		 * It works in similar way on Oasis: we call ads server (DFP) to check if there is targeted ad unit for a user.
		 * If there is and it's in a form of prestitial/interstitial the ad server calls our exposed JS function to
		 * display the ad in a form of modal. The ticket connected to the changes: ADEN-1834.
		 */
		Mercury.Modules.Ads.getInstance().openLightbox = (contents: any): void => {
			this.send('openLightbox', 'ads-lightbox', {contents: contents});
		}
	},

	actions: {
		loading: function (): void {
			this.controller.showLoader();
		},
		didTransition: function () {
			// Activate any A/B tests for the new route
			M.VariantTesting.activate();
			this.controller.hideLoader();
		},
		error: function () {
			this.controller.hideLoader();
		},
		handleLink: function (target: HTMLAnchorElement): void {
			var controller = this.controllerFor('article'),
				model = controller.get('model'),
				trackingCategory = target.dataset.trackingCategory,
				info = M.getLinkInfo(
					model.get('basePath'),
					model.get('title'),
					target.hash,
					target.href
				),
				// exec() returns an array of matches or null if no match is found.
				domainNameRegExpMatchArray: string[] = /\.[a-z0-9\-]+\.[a-z0-9]{2,}$/i.exec(window.location.hostname),
				cookieDomain: string = domainNameRegExpMatchArray ? '; domain=' + domainNameRegExpMatchArray[0] : '',
				defaultSkin: string = Em.getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

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
				if (target.href.indexOf('useskin=' + defaultSkin) > -1) {
					document.cookie = 'useskin=' + defaultSkin + cookieDomain + '; path=/';
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
			this.get('controller').set('noScroll', true);

			if (data) {
				this.controllerFor(lightboxName).set('data', data);
			}

			this.render(lightboxName, {
				into: 'application',
				outlet: 'lightbox'
			});
		},

		closeLightbox: function (): void {
			this.get('controller').set('noScroll', false);

			this.disconnectOutlet({
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
