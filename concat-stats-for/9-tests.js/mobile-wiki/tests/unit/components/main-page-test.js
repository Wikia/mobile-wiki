define('mobile-wiki/tests/unit/components/main-page-test', ['ember-qunit', 'require', 'sinon'], function (_emberQunit, _require2, _sinon) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track'),
	    adSlotComponentStub = Ember.Component.extend({});
	var setTrackContextStub = void 0,
	    trackPageViewStub = void 0;

	(0, _emberQunit.moduleForComponent)('main-page', 'Unit | Component | main page', {
		unit: true,
		needs: ['component:ad-slot', 'component:curated-content', 'component:wikia-ui-components/wiki-page-header-curated-main-page', 'service:ads', 'service:current-user', 'service:wiki-variables'],

		beforeEach: function beforeEach() {
			setTrackContextStub = _sinon.default.stub(trackModule, 'setTrackContext');
			trackPageViewStub = _sinon.default.stub(trackModule, 'trackPageView');
			this.register('component:ad-slot', adSlotComponentStub);
		},
		afterEach: function afterEach() {
			setTrackContextStub.restore();
			trackPageViewStub.restore();
		}
	});

	(0, _emberQunit.test)('injects ads', function (asset) {
		var adsContext = {
			valid: true
		},
		    injectMainPageAdsSpy = _sinon.default.spy(),
		    setupAdsContextSpy = _sinon.default.spy(),
		    component = this.subject({
			adsContext: adsContext,
			curatedContent: {},
			currentUser: {
				userModel: new Ember.RSVP.Promise(function () {})
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
});