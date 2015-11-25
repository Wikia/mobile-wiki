QUnit.module('Ads tests', function () {
	var origRequire;

	QUnit.test('Returns ads instance', function (assert) {
		var module = require('mercury/modules/Ads').default;

		assert.ok(module);
		assert.equal(typeof module.getInstance(), 'object');
	});

	QUnit.test('Init method works', function (assert) {
		var AdsModule = {},
			calledURL,
			callbackIsCalled = false,
			testAdsUrl = 'http://exampleAdsUrl.com/',
			instance;

		require.entries['mercury/modules/Ads'].callback(AdsModule, function(){}, null, function(url, callback) {
			calledURL = url;
			callback();
		});

		instance = AdsModule.default.getInstance();

		instance.reloadWhenReady = function () {
			callbackIsCalled = true;
		};

		instance.kruxTrackFirstPage = function() {};

		origRequire = require;
		window.require = function (modules, callback) {
			callback();
		};

		instance.init(testAdsUrl);

		window.require = origRequire;

		assert.equal(calledURL, testAdsUrl);
		assert.equal(callbackIsCalled, true);
	});

	QUnit.test('Reload ads works', function (assert) {
		var module = require('mercury/modules/Ads').default,
			testContext = {
				test: 1
			},
			setContextSpy = this.spy(),
			runSpy = this.spy(),
			incrementSpy = this.spy(),
			initDetectionSpy = this.spy(),
			instance = module.getInstance();

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
		var module = require('mercury/modules/Ads').default,
			instance = module.getInstance();

		assert.equal(instance.adSlots.length, 0);
		instance.addSlot('test1');
		assert.equal(instance.adSlots.length, 1);
		instance.removeSlot('test1');
		assert.equal(instance.adSlots.length, 0);
		instance.reload(null);
	});

	QUnit.test('Push slot to the current queue', function (assert) {
		var module = require('mercury/modules/Ads').default,
			instance = module.getInstance();

		instance.reload(null);
		assert.equal(instance.slotsQueue.length, 0);
		instance.pushSlotToQueue('MOBILE_IN_CONTENT');
		assert.equal(instance.slotsQueue.length, 1);
	});
});
