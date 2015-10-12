/// <reference path="../app.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../mercury/utils/articleLink.ts" />
/// <reference path="../../mercury/utils/variantTesting.ts" />
/// <reference path="../../mercury/utils/string.ts" />
'use strict';

App.ApplicationRoute = Em.Route.extend(Em.TargetActionSupport, App.TrackClickMixin, {
	queryParams: {
		commentsPage: {
			replace: true
		}
	},

	model: function <T>(params: T): T {
		return params;
	},

	activate: function (): void {
		var adsInstance: Mercury.Modules.Ads,
			instantGlobals = Wikia.InstantGlobals || {};

		if (M.prop('adsUrl') && !M.prop('queryParams.noexternals') && !instantGlobals.wgSitewideDisableAdsOnMercury) {
			adsInstance = Mercury.Modules.Ads.getInstance();
			adsInstance.init(M.prop('adsUrl'));

			/**
			 * This global function is being used by our AdEngine code to provide prestitial/interstitial ads
			 * It works in similar way on Oasis: we call ads server (DFP) to check if there is targeted ad unit for a user.
			 * If there is and it's in a form of prestitial/interstitial the ad server calls our exposed JS function to
			 * display the ad in a form of modal. The ticket connected to the changes: ADEN-1834.
			 * Created lightbox might be empty in case of lack of ads, so we want to create lightbox with argument
			 * lightboxVisible=false and then decide if we want to show it.
			 */
			adsInstance.createLightbox = (contents: any, lightboxVisible?: boolean): void => {
				var actionName = lightboxVisible ? 'openLightbox' : 'createHiddenLightbox';
				this.send(actionName, 'ads', {contents});
			};

			adsInstance.showLightbox = (): void => {
				this.send('showLightbox');
			};
		}
	},

	actions: {
		loading(): void {
			this.controller && this.controller.showLoader();
		},

		didTransition(): void {
			// Activate any A/B tests for the new route
			M.VariantTesting.activate();
			this.controller && this.controller.hideLoader();

			// Clear notification alerts for the new route
			this.controller.clearNotifications();

			/*
			 * This is called after the first route of any application session has loaded
			 * and is necessary to prevent the ArticleModel from trying to bootstrap from the DOM
			 */
			M.prop('articleContentPreloadedInDOM', false);

			// TODO (HG-781): This currently will scroll to the top even when the app has encountered an error.
			// Optimally, it would remain in the same place.
			window.scrollTo(0, 0);
		},

		error(): void {
			this.controller && this.controller.hideLoader();
		},

		handleLink(target: HTMLAnchorElement): void {
			var currentRoute = this.router.get('currentRouteName'),
				title: string,
				trackingCategory: string,
				info: LinkInfo,
				// exec() returns an array of matches or null if no match is found.
				domainNameRegExpMatchArray: RegExpExecArray = /\.[a-z0-9\-]+\.[a-z0-9]{2,}$/i.exec(window.location.hostname),
				cookieDomain: string = domainNameRegExpMatchArray ? '; domain=' + domainNameRegExpMatchArray[0] : '',
				defaultSkin: string = Em.getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

			if (currentRoute === 'article') {
				title = this.controllerFor('article').get('model').get('title');
			} else {
				title = '';
			}

			trackingCategory = target.dataset.trackingCategory;
			info = M.getLinkInfo(
				Mercury.wiki.basePath,
				title,
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
				if (target.href.indexOf('useskin=' + defaultSkin) > -1) {
					document.cookie = 'useskin=' + defaultSkin + cookieDomain + '; path=/';
				}
				return window.location.assign(target.href);
			}

			if (info.article) {
				this.transitionTo('article', info.article + (info.hash ? info.hash : ''));
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

		loadRandomArticle(): void {
			this.get('controller').send('toggleSideNav', false);

			App.ArticleModel
				.getArticleRandomTitle()
				.then((articleTitle: string): void => {
					this.transitionTo('article', encodeURIComponent(M.String.normalizeToUnderscore(articleTitle)));
				})
				.catch((err: any): void => {
					this.send('error', err);
				});
		},

		search: function (searchString : string) {
			this.transitionTo('searchResults', {queryParams: {
				q: searchString,
			}});
		},

		// We need to proxy these actions because of the way Ember is bubbling them up through routes
		// see http://emberjs.com/images/template-guide/action-bubbling.png
		handleLightbox(): void {
			this.get('controller').send('handleLightbox');
		},

		openLightbox(lightboxType: string, lightboxModel?: any): void {
			this.get('controller').send('openLightbox', lightboxType, lightboxModel);
		},

		createHiddenLightbox(lightboxType: string, lightboxModel?: any): void {
			this.get('controller').send('createHiddenLightbox', lightboxType, lightboxModel);
		},

		showLightbox(): void {
			this.get('controller').send('showLightbox');
		},

		closeLightbox(): void {
			this.get('controller').send('closeLightbox');
		},

		// This is used only in not-found.hbs template
		toggleSideNav(visible: boolean): void {
			this.get('controller').set('sideNavVisible', visible);
		}
	}
});
