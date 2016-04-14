import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const setTrackContext = require('common/utils/track').setTrackContext,
	trackPageView = require('common/utils/track').trackPageView;

moduleForComponent('main-page', 'Unit | Component | main page', {
	unit: true,

	beforeEach() {
		require('common/utils/track').setTrackContext = Ember.K;
		require('common/utils/track').trackPageView = Ember.K;
	},

	afterEach() {
		require('common/utils/track').trackPageView = trackPageView;
		require('common/utils/track').setTrackContext = setTrackContext;
	}
});

test('reacts on curated content change', function (asset) {
	const adsContext = {
			valid: true
		},
		injectMainPageAdsSpy = sinon.spy(),
		setupAdsContextSpy = sinon.spy(),
		component = this.subject({
			adsContext,
			curatedContent: {},
			currentUser: {
				userModel: new Ember.RSVP.Promise(Ember.K)
			},
			injectMainPageAds: injectMainPageAdsSpy,
			setupAdsContext: setupAdsContextSpy
		});

	component.didRender();

	asset.ok(injectMainPageAdsSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledWith(adsContext));
});
