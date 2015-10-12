moduleForComponent('main-page', 'MainPageComponent', {
	unit: true,

	setup: function () {
		M.setTrackContext = function () {};
		M.trackPageView = function () {};
		M.trackAds = function () {};
		M.updateTrackedUrl = function () {};
	}
});

test('reacts on curated content change', function () {
	var self = this,
		adsContext = {
			valid: true
		},
		injectMainPageAdsSpy = sinon.spy(),
		setupAdsContextSpy = sinon.spy(),
		component;

	Ember.run(function () {
		// This has to be wrapped in Ember.run because didReceiveAttrs uses Em.run.schedule
		// and it's called when the component is created by .subject()
		component = self.subject({
			attrs: {
				adsContext: adsContext,
				curatedContent: {}
			}
		});

		component.injectMainPageAds = injectMainPageAdsSpy;
		component.setupAdsContext = setupAdsContextSpy;
	});

	ok(injectMainPageAdsSpy.calledOnce);
	ok(setupAdsContextSpy.calledOnce);
	ok(setupAdsContextSpy.calledWith(adsContext))
});
