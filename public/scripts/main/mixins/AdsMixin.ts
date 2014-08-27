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

	injectAds: function (adsContext: any): void {
		var $firstSection = this.$('h2').first(),
			$articleBody = this.$('.article-body'),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			showInContent = firstSectionTop > this.adsData.minZerothSectionLength,
			showPreFooter = $articleBody.height() > this.adsData.minPageLength || firstSectionTop < this.adsData.minZerothSectionLength;

		window.ads = {
			context: adsContext
		};

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'before', $firstSection.parent());
		}

		if (showPreFooter) {
			this.appendAd(this.adsData.mobilePreFooter, 'after', $articleBody);
		}
	}
});
