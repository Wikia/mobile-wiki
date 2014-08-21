/// <reference path="../app.ts" />
'use strict';

App.AdsMixin = Em.Mixin.create({
	adsData: {
		minZerothSectionLength: 700,
		minPageLength: 2000,
		mobileInContent: 'MOBILE_IN_CONTENT',
		mobilePreFooter: 'MOBILE_PREFOOTER',
		showAds: window.wgShowAds && !window.document.referrer.match(/info.tvsideview.sony.net/)
	},

	appendAd: function (adSlotName, place, element) {
		var view = this.createChildView(App.AdSlotComponent, {
			name: adSlotName
		}).createElement();

		element[place](view.$());
		view.trigger('didInsertElement');
	},

	injectAds: function () {
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
	}
});
