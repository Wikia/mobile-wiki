import { Promise as EmberPromise } from 'rsvp';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import require from 'require';
import sinon from 'sinon';
import * as adsModule from 'mobile-wiki/modules/ads';
import { getAdsModuleMock } from '../../helpers/mock-ads-service';

const trackModule = require('mobile-wiki/utils/track');
const adSlotComponentStub = Component.extend({});
let setTrackContextStub;
let trackPageViewStub;

module('Unit | Component | main page', (hooks) => {
	setupTest(hooks);
	let adsModuleStub;

	hooks.beforeEach(function () {
		adsModuleStub = sinon.stub(adsModule, 'default').returns({ then: cb => cb(getAdsModuleMock()) });
		setTrackContextStub = sinon.stub(trackModule, 'setTrackContext');
		trackPageViewStub = sinon.stub(trackModule, 'trackPageView');
		this.owner.register('component:ad-slot', adSlotComponentStub);
	});

	hooks.afterEach(() => {
		setTrackContextStub.restore();
		trackPageViewStub.restore();
		adsModuleStub.restore();
	});

	test('injects ads', function (assert) {
		const adsContext = {
			valid: true,
		};
		const injectMainPageAdsSpy = sinon.spy();
		const setupAdsContextSpy = sinon.spy();
		const component = this.owner.factoryFor('component:main-page').create({
			adsContext,
			curatedContent: {},
			currentUser: {
				userModel: new EmberPromise(() => {}),
			},
			injectMainPageAds: injectMainPageAdsSpy,
			setupAdsContext: setupAdsContextSpy,
		});

		component.get('ads.module').isLoaded = true;
		run(() => {
			component.didInsertElement();
		});

		assert.ok(setupAdsContextSpy.calledOnce, 'setupAdsContextSpy called');
		assert.ok(setupAdsContextSpy.calledWith(adsContext), 'setupAdsContextSpy called with ads context');
		assert.ok(injectMainPageAdsSpy.calledOnce, 'injectMainPageAds called');
	});
});
