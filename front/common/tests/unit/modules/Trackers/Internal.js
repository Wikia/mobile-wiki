var scriptsArray,
	InternalModule = {},
	InternalTracker;

QUnit.module('Internal tracker createRequestURL method tests when isPageView returns true', {
	setup: function () {
		M.prop('apiBase', '/api/mercury', true);
		M.provide('wiki', {
			language: {
				content: 'en'
			}
		});

		require.entries['common/modules/Trackers/Internal'].callback(InternalModule);
		InternalTracker = InternalModule.default;
		InternalTracker.isPageView = function () {
			return true;
		};
		this.tracker = new InternalTracker();
		this.tracker.baseUrl = 'http://wikia.com/';
	}
});

QUnit.test('empty params', function (assert) {
	var result = this.tracker.createRequestURL('foo', {});

	assert.equal(result, 'http://wikia.com/view?', 'Request url is equal to expected');
});

QUnit.test('params are object without empty values', function (assert) {
	var result = this.tracker.createRequestURL('foo', {
		fizz: 'buzz',
		fizz2: 'buzz2'
	});

	assert.equal(result, 'http://wikia.com/view?fizz=buzz&fizz2=buzz2', 'Request url is equal to expected');
});

QUnit.test('params are encoded', function (assert) {
	var result = this.tracker.createRequestURL('foo', {
		'fizz&&&': 'buzz???'
	});

	assert.equal(result, 'http://wikia.com/view?fizz%26%26%26=buzz%3F%3F%3F', 'Request url is equal to expected');
});

QUnit.test('params are object with empty values', function (assert) {
	var result = this.tracker.createRequestURL('foo', {
		fizz: 'buzz',
		fizz2: null
	});

	assert.equal(result, 'http://wikia.com/view?fizz=buzz', 'Request url is equal to expected');
});

QUnit.module('Internal tracker createRequestURL method tests when isPageView returns false', {
	setup: function () {
		require.entries['common/modules/Trackers/Internal'].callback(InternalModule);
		InternalTracker = InternalModule.default;
		InternalTracker.isPageView = function () {
			return false;
		};
		this.tracker = new InternalTracker();
		this.tracker.baseUrl = 'http://wikia.com/';
	}
});

QUnit.test('params are object without empty values', function (assert) {
	var result = this.tracker.createRequestURL('foo', {
		fizz: 'buzz',
		fizz2: 'buzz2'
	});

	assert.equal(result, 'http://wikia.com/special/trackingevent?fizz=buzz&fizz2=buzz2',
		'Request url is equal to expected');
});

QUnit.module('Internal tracker loadTrackingScript', {
	setup: function () {
		require.entries['common/modules/Trackers/Internal'].callback(InternalModule);
		InternalTracker = InternalModule.default;
		this.tracker = new InternalTracker();
		this.tracker.scriptLoadedHandler = function () {};
		this.tracker.head = {
			insertBefore: function (script) {
				scriptsArray.push(script);
			}
		};
		scriptsArray = [];
	},
	teardown: function () {
		scriptsArray = [];
	}}
);

QUnit.test('load tracking script', function (assert) {
	var scriptElementMock = {},
		scriptsCountBeforeLoad = scriptsArray.length,
		scriptsCountAfterLoad,
		insertedScript;

	this.tracker.loadTrackingScript('scriptUrl', scriptElementMock);
	insertedScript = scriptsArray[0];

	scriptsCountAfterLoad = scriptsArray.length;
	assert.equal(scriptsCountAfterLoad - scriptsCountBeforeLoad, 1, 'Script is inserted in head');
	assert.equal(typeof insertedScript.onload === 'function', true, 'Script has onload handler assigned');
	assert.equal(typeof insertedScript.onreadystatechange === 'function', true,
		'Script has onreadystatechange handler assigned');
	assert.equal(insertedScript.src, 'scriptUrl', 'Script has correct url');
});

QUnit.module('Track', {
	setup: function () {
		require.entries['common/modules/Trackers/Internal'].callback(InternalModule);
		InternalTracker = InternalModule.default;
		this.tracker = new InternalTracker();
		this.tracker.loadTrackingScript = sinon.spy();
		this.tracker.createRequestURL = sinon.spy();
	}
});

QUnit.test('test if track is calling right functions', function (assert) {
	this.tracker.track({});
	assert.ok(this.tracker.loadTrackingScript.called);
	assert.ok(this.tracker.createRequestURL.called);
});
