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
	adViews: <Em.View[]>[],

	appendAd: function (adSlotName: string, place: string, element: JQuery): void {
		// Keep in mind we always want to pass noAds parameter to the AdSlot component
		// Right now we've got three ad slots and it doesn't make sense to add assertion
		// in willInsertElement hook of the component to check if the parameters is really defined
		var view = this.createChildView(App.AdSlotComponent, {
			name: adSlotName,
			noAds: this.get('controller.noAds')
		}).createElement();

		element[place](<string>view.$());
		this.adViews.push(view);

		view.trigger('didInsertElement');
	},

	clearAdViews: function() {
		var adView: Em.View;
		while (adView = this.adViews.pop()) {
			adView.destroyElement();
		}
	},

	injectAds: function (): void {
		var $firstSection = this.$('.article-content > h2').first(),
			$articleBody = this.$('.article-body'),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			showInContent = firstSectionTop > this.adsData.minZerothSectionLength,
			showPreFooter = $articleBody.height() > this.adsData.minPageLength || firstSectionTop < this.adsData.minZerothSectionLength;

		this.clearAdViews();

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'before', $firstSection);
		}

		if (showPreFooter) {
			this.appendAd(this.adsData.mobilePreFooter, 'after', $articleBody);
		}
	},

	/**
	 * @desc Load ads for main page.
	 * InContent ad should be displayed below curated content only when it's available.
	 * Prefooter ad should be loaded above footer
	 * only when trending articles and/or trending videos are loaded.
	 */
	injectMainPageAds: function (): void {
		var showInContent,
			$curatedContent = this.$('.curated-content');
		//Curated content section is present - show in content ad
		showInContent = $curatedContent.length > 0;

		this.clearAdViews();

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'after', $curatedContent);
		}
	},

	setupAdsContext: function (adsContext: any): void {
		Mercury.Modules.Ads.getInstance().reload(adsContext);
	}
});
