/// <reference path="../app.ts" />

'use strict';

App.MainPageView = Em.View.extend(App.AdsMixin, {
	didInsertElement: function (): void {
		var model = this.get('controller.model');

		this.injectMainPageAds();
		this.setupAdsContext(model.get('adsContext'));
		M.setTrackContext({
			a: model.title,
			n: model.ns
		});

		M.trackPageView(model.get('adsContext.targeting'));
	}
});
