QUnit.module('mercury/modules/Ads', function (hooks) {
	var Ads,
		loadStub = sinon.stub().callsArg(1),
		origRequire;

	hooks.beforeEach(function () {
		var exports = {};

		mrequire.entries['mercury/modules/Ads'].callback(exports, sinon.stub(), {}, loadStub);

		Ads = exports.default;
	});

	hooks.afterEach(function () {
		loadStub.reset();
	});

	QUnit.test('Returns ads instance', function (assert) {
		assert.ok(Ads);
		assert.equal(typeof Ads.getInstance(), 'object');
	});

	QUnit.test('Init method works', function (assert) {
		var testAdsUrl = 'http://exampleAdsUrl.com/',
			reloadWhenReadyStub = sinon.stub(),
			instance;

		instance = Ads.getInstance();

		instance.reloadWhenReady = reloadWhenReadyStub;
		instance.kruxTrackFirstPage = sinon.stub();

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
			setContextSpy = this.spy(),
			runSpy = this.spy(),
			incrementSpy = this.spy(),
			initDetectionSpy = this.spy(),
			instance = Ads.getInstance();

		instance.adContextModule = {
			setContext: setContextSpy
		};
		instance.adEngineModule = {
			run: runSpy
		};
		instance.sourcePointDetectionModule = {
			initDetection: initDetectionSpy
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
		instance.adEngineModule = undefined;
		instance.adConfigMobile = undefined;
		instance.adLogicPageViewCounterModule = undefined;
		instance.adSlots = [];
	});

	QUnit.test('Add/remove slots works', function (assert) {
		var instance = Ads.getInstance();

		assert.equal(instance.adSlots.length, 0);
		instance.addSlot('test1');
		assert.equal(instance.adSlots.length, 1);
		instance.removeSlot('test1');
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
