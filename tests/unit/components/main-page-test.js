import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import require from 'require';
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
		'service:current-user',
		'service:wiki-variables'
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
		setupAdsContextSpy = sinon.spy(),
		component = this.subject({
			adsContext,
			curatedContent: {},
			currentUser: {
				userModel: new Ember.RSVP.Promise(() => {})
			},
			injectMainPageAds: injectMainPageAdsSpy,
			setupAdsContext: setupAdsContextSpy
		});

	component.get('ads.module').isLoaded = true;
	this.render();

	asset.ok(setupAdsContextSpy.calledOnce, 'setupAdsContextSpy called');
	asset.ok(setupAdsContextSpy.calledWith(adsContext), 'setupAdsContextSpy called with ads context');
	asset.ok(injectMainPageAdsSpy.calledOnce, 'injectMainPageAds called');
});
