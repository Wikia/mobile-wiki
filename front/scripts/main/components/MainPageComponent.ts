/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />

'use strict';

App.MainPageComponent = Em.Component.extend(App.AdsMixin, App.TrackClickMixin, {
	classNames: ['main-page-modules', 'main-page-body'],
	tagName: 'section',

	featuredContentComponentVariation: Em.computed(function (): string {
		var experimentIds = {
				prod: '3079180094',
				dev: '3054131385'
			},
			variationNumber = Mercury.Utils.VariantTesting.getExperimentVariationNumber(experimentIds);

		switch (variationNumber) {
			case 1:
				return 'featured-content-variation-1';
			case 2:
				return 'featured-content-variation-2';
			case 3:
				return 'featured-content-variation-3';
			default:
				return 'featured-content';
		}
	}),

	curatedContentToolButtonVisible: Em.computed.and('currentUser.rights.curatedcontent'),

	didReceiveAttrs(): void {
		Em.run.schedule('afterRender', this, (): void => {
			M.setTrackContext({
				a: this.get('title'),
				n: this.get('ns')
			});

			M.updateTrackedUrl(window.location.href);
			M.trackPageView(this.get('adsContext.targeting'));

			this.injectMainPageAds();
			this.setupAdsContext(this.get('adsContext'));
		});
	},

	actions: {
		openLightbox(lightboxType: string, lightboxData: any): void {
			this.sendAction('openLightbox', lightboxType, lightboxData);
		},

		openCuratedContentItem(item: CuratedContentItem): void {
			this.sendAction('openCuratedContentItem', item);
		}
	}
});
