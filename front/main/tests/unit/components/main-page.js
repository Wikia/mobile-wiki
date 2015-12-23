var setTrackContext,
	trackPageView,
	updateTrackedUrl;

moduleForComponent('main-page', 'MainPageComponent', {
	unit: true,

	setup: function () {
		setTrackContext = mrequire('mercury/utils/track').setTrackContext;
		mrequire('mercury/utils/track').setTrackContext = Em.K;

		trackPageView = mrequire('mercury/utils/track').trackPageView;
		mrequire('mercury/utils/track').trackPageView = Em.K;

		updateTrackedUrl = mrequire('mercury/utils/track').updateTrackedUrl;
		mrequire('mercury/utils/track').updateTrackedUrl = Em.K;
	},

	teardown: function () {
		mrequire('mercury/utils/track').updateTrackedUrl = updateTrackedUrl;
		mrequire('mercury/utils/track').trackPageView = trackPageView;
		mrequire('mercury/utils/track').setTrackContext = setTrackContext;
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
