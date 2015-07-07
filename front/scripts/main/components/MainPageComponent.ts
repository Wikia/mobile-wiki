/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />

'use strict';

App.MainPageComponent = Em.Component.extend(App.AdsMixin, App.TrackClickMixin, {
	classNames: ['main-page-modules', 'main-page-body', 'mw-content'],
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

	/**
	 * @desc Component is reused so we have to observe on curatedContent to detect transitions between routes
	 */
	curatedContentObserver: Em.observer('curatedContent', function (): void {
		// TODO (ADEN-2189): This should be refactored, ads should be initialized only once
		this.sendAction('setupAds', this.get('adsContext'));

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
	}).on('didInsertElement'),

	actions: {
		openLightbox: function (lightboxType: string, lightboxData: any): void {
			this.sendAction('openLightbox', lightboxType, lightboxData);
		},

		openCuratedContentItem: function (item: CuratedContentItem): void {
			this.sendAction('openCuratedContentItem', item);
		}
	}
});
