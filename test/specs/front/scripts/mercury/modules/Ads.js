QUnit.module('Ads tests', {
	setup: function () {
		M.prop('adsUrl', 'http://exampleAdsUrl.com/')
	}
});

QUnit.test('Returns ads instance', function () {
	ok(Mercury.Modules.Ads);
	equal(typeof Mercury.Modules.Ads.getInstance(), 'object');
});

QUnit.test('Init method works', function() {
	var calledURL,
		callbackIsCalled = false,
		testAdsUrl = 'http://exampleAdsUrl.com/',
		instance = Mercury.Modules.Ads.getInstance(),
		loadStub = this.stub(M, 'load', function(url, callback) {
			calledURL = url;
			callback();
		});
	require = function(modules, callback){
		callback();
	};

	instance.init(function () {
		callbackIsCalled = true;
	});
	delete(require);
	equal(calledURL, testAdsUrl);
	equal(callbackIsCalled, true);
});

QUnit.test('Reload ads works', function () {
	var adEngineRun = false,
		testContext = {
			test: 1
		},
		setContextSpy = this.spy(),
		runSpy = this.spy(),
		instance = Mercury.Modules.Ads.getInstance();

	instance.adContextModule = {
		setContext: setContextSpy
	};
	instance.adEngineModule = {
		run: runSpy
	};
	instance.adConfigMobile = {
		test: 2
	};
	instance.adSlots = [
		['slot1']
	];

	instance.reload(testContext);
	ok(setContextSpy.calledWith(testContext));
	ok(runSpy.calledWith(instance.adConfigMobile, instance.adSlots, 'queue.mercury'));
	instance.adContextModule = undefined;
	instance.adEngineModule = undefined;
	instance.adConfigMobile = undefined;
	instance.adSlots = [];
});

QUnit.test('Add/remove slots works', function () {
	var instance = Mercury.Modules.Ads.getInstance();
	equal(instance.adSlots.length, 0);
	instance.addSlot('test1');
	equal(instance.adSlots.length, 1);
	instance.removeSlot('test1');
	equal(instance.adSlots.length, 0);
	instance.reload(null);
});
