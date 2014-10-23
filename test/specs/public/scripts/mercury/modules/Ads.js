QUnit.module('Ads tests');

QUnit.test('Returns ads instance', function () {
	ok(Mercury.Modules.Ads);
	equal(typeof Mercury.Modules.Ads.getInstance(), 'object');
});

QUnit.test('Init method works', function() {
	var calledURL,
		callbackIsCalled = false,
		testUrl = 'http://example.com/',
		instance = Mercury.Modules.Ads.getInstance(),
		loadStub = this.stub(M, 'load', function(url, callback) {
			calledURL = url;
			callback();
		});
	require = function(modules, callback){
		callback();
	};

	instance.init(testUrl, function () {
		callbackIsCalled = true;
	});
	delete(require);
	equal(calledURL, testUrl);
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
	instance.adContext = {
		setContext: setContextSpy
	},
	instance.adEngine = {
		run: runSpy
	};
	instance.adConfigMobile = {
		test: 2
	}
	instance.adSlots = [
		['slot1']
	];
	instance.reload(testContext);
	ok(setContextSpy.calledWith(testContext));
	ok(runSpy.calledWith(instance.adConfigMobile, instance.adSlots, 'queue.mobile'));
	instance.adContext = undefined;
	instance.adEngine = undefined;
	instance.adConfigMobile = undefined;
	instance.adSlots = [];
});

QUnit.test('Add/remove slots works', function () {
	var instance = Mercury.Modules.Ads.getInstance();
	equal(instance.adSlots.length, 0);
});
