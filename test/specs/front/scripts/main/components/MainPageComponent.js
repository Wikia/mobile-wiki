moduleForComponent('main-page', 'MainPageComponent', {
	setup: function () {
		M.setTrackContext = function () {};
		M.trackPageView = function () {};
		M.trackAds = function () {};
		M.updateTrackedUrl = function () {};
	}
});

test('reacts on curated content change', function () {
	var componentMock = this.subject(),
		adsContext = {
			valid: true
		},
		newAttrs = {
			adsContext: adsContext,
			curatedContent: {}
		},
		injectMainPageAdsSpy = sinon.spy(),
		setupAdsContextSpy = sinon.spy();

	componentMock.injectMainPageAds = injectMainPageAdsSpy;
	componentMock.setupAdsContext = setupAdsContextSpy;

	Ember.run(function () {
		componentMock.set('attrs', newAttrs);

		componentMock.trigger('didReceiveAttrs', {
			newAttrs: newAttrs
		});
	});

	ok(injectMainPageAdsSpy.calledOnce);
	ok(setupAdsContextSpy.calledWith(adsContext))
});
