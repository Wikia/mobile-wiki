import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';

const trackModule = require('mobile-wiki/utils/track'),
	adSlotComponentStub = Ember.Component.extend({});
let setTrackContextStub,
	trackPageViewStub;

moduleForComponent('main-page', 'Unit | Component | main page', {
	unit: true,
	needs: [
		'component:ad-slot',
		'component:curated-content',
		'component:wikia-ui-components/wiki-page-header-curated-main-page',
		'service:ads',
		'service:current-user'
	],

	beforeEach() {
		setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
		trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
		this.register('component:ad-slot', adSlotComponentStub);
	},

	afterEach() {
		setTrackContextStub.restore();
		trackPageViewStub.restore();
	}
});

test('injects ads', function (asset) {
	const adsContext = {
			valid: true
		},
		injectMainPageAdsSpy = sinon.spy(),
		setupAdsContextSpy = sinon.spy();

	this.subject({
		adsContext,
		curatedContent: {},
		currentUser: {
			userModel: new Ember.RSVP.Promise(function () {})
		},
		injectMainPageAds: injectMainPageAdsSpy,
		setupAdsContext: setupAdsContextSpy
	});

	this.render();

	asset.ok(injectMainPageAdsSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledOnce);
	asset.ok(setupAdsContextSpy.calledWith(adsContext));
});
