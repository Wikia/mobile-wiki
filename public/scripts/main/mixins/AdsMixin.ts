/// <reference path="../app.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />
'use strict';

App.AdsMixin = Em.Mixin.create({
	adsData: {
		minZerothSectionLength: 700,
		minPageLength: 2000,
		mobileInContent: 'MOBILE_IN_CONTENT',
		mobilePreFooter: 'MOBILE_PREFOOTER'
	},

	appendAd: function (adSlotName: string, place: string, element: JQuery): void {
		var view = this.createChildView(App.AdSlotComponent, {
			name: adSlotName
		}).createElement();

		element[place](<string>view.$());
		view.trigger('didInsertElement');
	},

	injectAds: function (): void {
		var $firstSection = this.$('h2').first(),
			$articleBody = this.$('.article-body'),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			showInContent = firstSectionTop > this.adsData.minZerothSectionLength,
			showPreFooter = $articleBody.height() > this.adsData.minPageLength || firstSectionTop < this.adsData.minZerothSectionLength;

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'before', $firstSection.parent());
		}

		if (showPreFooter) {
			this.appendAd(this.adsData.mobilePreFooter, 'after', $articleBody);
		}
	},

	setupAdsContext: function (adsContext: any): void {
		// FIXME: this is temporary solution
		// this requires refactoring adEngine to support UMD
		//
		// On the first run require is undefined but the run is executed in the mercury.js file relying on the
		// window setting for the context.
		if (typeof require !== 'undefined') {
			require([
				'ext.wikia.adEngine.adEngine',
				'ext.wikia.adEngine.adConfigMobile'
			], function(adEngine: any, adConfigMobile: any){
				adConfigMobile.setContext(adsContext);
				adEngine.run(adConfigMobile, JSON.parse(JSON.stringify(Wikia.ads.slots)), 'queue.mobile');
			});
		}
	}
});
