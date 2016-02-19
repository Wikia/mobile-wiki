import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const setTrackContext = require('common/utils/track').setTrackContext,
	trackPageView = require('common/utils/track').trackPageView,
	updateTrackedUrl = require('common/utils/track').updateTrackedUrl;

moduleForComponent('main-page', 'Unit | Component | main page', {
	unit: true,

	beforeEach() {
		require('common/utils/track').setTrackContext = Ember.K;
		require('common/utils/track').trackPageView = Ember.K;
		require('common/utils/track').updateTrackedUrl = Ember.K;
	},

	afterEach() {
		require('common/utils/track').updateTrackedUrl = updateTrackedUrl;
		require('common/utils/track').trackPageView = trackPageView;
		require('common/utils/track').setTrackContext = setTrackContext;
	}
});

test('reacts on curated content change', function (asset) {
	const adsContext = {
			valid: true
		},
		injectMainPageAdsSpy = sinon.spy(),
		setupAdsContextSpy = sinon.spy();

	Ember.run(() => {
		const component = this.subject({
			attrs: {
				adsContext,
				curatedContent: {},
				currentUser: {
					powerUserTypes: new Ember.RSVP.Promise(Ember.K)
				}
			}
		});

		component.injectMainPageAds = injectMainPageAdsSpy;
		component.setupAdsContext = setupAdsContextSpy;
	});

	asset.ok(injectMainPageAdsSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledWith(adsContext));
});
