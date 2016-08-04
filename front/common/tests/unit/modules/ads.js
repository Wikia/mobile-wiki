QUnit.module('mercury/modules/ads', function (hooks) {
	var Ads, trackerUA,
		loadStub = sinon.stub().callsArg(1);

	hooks.beforeEach(function () {
		var exports = {};

		require.entries['common/modules/ads'].callback(exports, loadStub);

		Ads = exports.default;
		trackerUA = M.tracker.UniversalAnalytics;
		M.tracker.UniversalAnalytics = {
			trackAds: sinon.stub(),
			track: sinon.stub(),
			setDimension: sinon.stub(),
		};
	});

	hooks.afterEach(function () {
		M.tracker.UniversalAnalytics = trackerUA;
		loadStub.reset();
	});

	QUnit.test('Returns ads instance', function (assert) {
		assert.ok(Ads);
		assert.equal(typeof Ads.getInstance(), 'object');
	});

	QUnit.test('Init method works', function (assert) {
		var testAdsUrl = 'http://exampleAdsUrl.com/',
			reloadWhenReadyStub = sinon.stub(),
			instance,
			origRequire;

		instance = Ads.getInstance();

		instance.reloadWhenReady = reloadWhenReadyStub;
		instance.trackKruxPageView = sinon.stub();

		origRequire = window.require;
		window.require = function (modules, callback) {
			callback();
		};

		instance.init(testAdsUrl);

		window.require = origRequire;

		assert.ok(loadStub.calledWith(testAdsUrl));
		assert.ok(reloadWhenReadyStub.calledOnce);
	});

	QUnit.test('Reload ads works', function (assert) {
		var testContext = {
				test: 1
			},
			setContextSpy = sinon.spy(),
			runSpy = sinon.spy(),
			incrementSpy = sinon.spy(),
			initDetectionSpy = sinon.spy(),
			startOnLoadQueue = sinon.spy(),
			instance = Ads.getInstance();

		instance.adContextModule = {
			setContext: setContextSpy
		};
		instance.adEngineRunnerModule = {
			run: runSpy
		};
		instance.sourcePointDetectionModule = {
			initDetection: initDetectionSpy
		};
		instance.adMercuryListenerModule = {
			startOnLoadQueue: startOnLoadQueue
		};
		instance.adConfigMobile = {
			test: 2
		};
		instance.adLogicPageViewCounterModule = {
			increment: incrementSpy
		};
		instance.adSlots = [
			['slot1']
		];
		instance.isLoaded = true;

		instance.reload(testContext);
		assert.ok(setContextSpy.calledWith(testContext));
		assert.ok(incrementSpy.calledOnce);
		assert.ok(initDetectionSpy.calledOnce);
		assert.ok(runSpy.calledWith(instance.adConfigMobile, instance.adSlots, 'queue.mercury'));
		instance.adContextModule = undefined;
		instance.adEngineRunnerModule = undefined;
		instance.adConfigMobile = undefined;
		instance.adLogicPageViewCounterModule = undefined;
		instance.adMercuryListenerModule = undefined;
		instance.adSlots = [];
	});

	QUnit.test('Add/remove slots works', function (assert) {
		var instance = Ads.getInstance();

		instance.addSlot({
			name: 'test3',
			onSuccess: function() {

			}
		});
		instance.removeSlot('test3');
		assert.equal(instance.adSlots.length, 0);
		instance.reload(null);
	});

	QUnit.test('Push slot to the current queue', function (assert) {
		var instance = Ads.getInstance();

		instance.reload(null);
		assert.equal(instance.slotsQueue.length, 0);
		instance.pushSlotToQueue('MOBILE_IN_CONTENT');
		assert.equal(instance.slotsQueue.length, 1);
	});
});
