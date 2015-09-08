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
		};

	expect(2);

	componentMock.injectMainPageAds = function () {
		ok(true, 'Main page ads injected');
	};

	componentMock.setupAdsContext = function (context) {
		equal(context, adsContext);
	};

	Ember.run(function () {
		componentMock.set('attrs', newAttrs);

		componentMock.trigger('didReceiveAttrs', {
			newAttrs: newAttrs
		});
	});
});
