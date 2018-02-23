import {Promise as EmberPromise} from 'rsvp';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import require from 'require';
import sinon from 'sinon';

const trackModule = require('mobile-wiki/utils/track'),
	adSlotComponentStub = Component.extend({});
let setTrackContextStub,
	trackPageViewStub;

module('Unit | Component | main page', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
		trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
		this.owner.register('component:ad-slot', adSlotComponentStub);
	});

	hooks.afterEach(() => {
		setTrackContextStub.restore();
		trackPageViewStub.restore();
	});

	test('injects ads', function (asset) {
		const adsContext = {
				valid: true
			},
			injectMainPageAdsSpy = sinon.spy(),
			setupAdsContextSpy = sinon.spy(),
			component = this.owner.factoryFor('component:main-page').create({
				adsContext,
				curatedContent: {},
				currentUser: {
					userModel: new EmberPromise(() => {})
				},
				injectMainPageAds: injectMainPageAdsSpy,
				setupAdsContext: setupAdsContextSpy
			});

		component.get('ads.module').isLoaded = true;
		run(() => {
			component.didInsertElement();
		});

		asset.ok(setupAdsContextSpy.calledOnce, 'setupAdsContextSpy called');
		asset.ok(setupAdsContextSpy.calledWith(adsContext), 'setupAdsContextSpy called with ads context');
		asset.ok(injectMainPageAdsSpy.calledOnce, 'injectMainPageAds called');
	});
});
