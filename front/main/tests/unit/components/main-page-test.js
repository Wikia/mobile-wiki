import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const trackModule = require('common/utils/track');
let setTrackContextStub,
	trackPageViewStub;

moduleForComponent('main-page', 'Unit | Component | main page', {
	unit: true,

	beforeEach() {
		setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
		trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
	},

	afterEach() {
		setTrackContextStub.restore();
		trackPageViewStub.restore();
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
