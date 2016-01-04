import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

var setTrackContext,
	trackPageView,
	updateTrackedUrl;

moduleForComponent('main-page', 'Unit | Component | main page', {
	unit: true,

	beforeEach: function () {
		setTrackContext = require('common/utils/track').setTrackContext;
		require('common/utils/track').setTrackContext = Ember.K;

		trackPageView = require('common/utils/track').trackPageView;
		require('common/utils/track').trackPageView = Ember.K;

		updateTrackedUrl = require('common/utils/track').updateTrackedUrl;
		require('common/utils/track').updateTrackedUrl = Ember.K;
	},

	afterEach: function () {
		require('common/utils/track').updateTrackedUrl = updateTrackedUrl;
		require('common/utils/track').trackPageView = trackPageView;
		require('common/utils/track').setTrackContext = setTrackContext;
	}
});

test('reacts on curated content change', function (asset) {
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

	asset.ok(injectMainPageAdsSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledWith(adsContext))
});
