/* global Mercury */
var scriptsArray;

QUnit.module('Internal tracker createRequestURL method tests when isPageView returns true', {
	setup: function () {
		Mercury.Modules.Trackers.Internal.isPageView = function() {return true;};
		this.tracker = new Mercury.Modules.Trackers.Internal();
		this.tracker.baseUrl = 'http://wikia.com/';
	}
});

QUnit.test('empty params', function () {
	var result = this.tracker.createRequestURL('foo', {});

	equal(result, 'http://wikia.com/view?', 'Request url is equal to expected');
});

QUnit.test('params are object without empty values', function () {
	var result = this.tracker.createRequestURL('foo', {
		'fizz': 'buzz',
		'fizz2': 'buzz2'
	});

	equal(result, 'http://wikia.com/view?fizz=buzz&fizz2=buzz2', 'Request url is equal to expected');
});

QUnit.test('params are object with empty values', function () {
	var result = this.tracker.createRequestURL('foo', {
		'fizz': 'buzz',
		'fizz2': null
	});

	equal(result, 'http://wikia.com/view?fizz=buzz', 'Request url is equal to expected');
});

QUnit.module('Internal tracker createRequestURL method tests when isPageView returns false', {
	setup: function () {
		Mercury.Modules.Trackers.Internal.isPageView = function() {return false;};
		this.tracker = new Mercury.Modules.Trackers.Internal();
		this.tracker.baseUrl = 'http://wikia.com/';
	}
});

QUnit.test('params are object without empty values', function () {
	var result = this.tracker.createRequestURL('foo', {
		'fizz': 'buzz',
		'fizz2': 'buzz2'
	});

	equal(result, 'http://wikia.com/special/trackingevent?fizz=buzz&fizz2=buzz2', 'Request url is equal to expected');
});

QUnit.module('Internal tracker loadTrackingScript', {
	setup: function () {
		this.tracker = new Mercury.Modules.Trackers.Internal();
		this.tracker.scriptLoadedHandler = function() {};
		this.tracker.head = {
			insertBefore: function(script) {
				scriptsArray.push(script);
			}
		};
		scriptsArray = [];
	},
	teardown: function() {
		scriptsArray = [];
	}}
);

QUnit.test('load tracking script', function () {
	var head = document.head,
		scriptElementMock = {},
		scriptsCountBeforeLoad = scriptsArray.length,
		scriptsCountAfterLoad,
		insertedScript;

	this.tracker.loadTrackingScript('scriptUrl', scriptElementMock);
	insertedScript = scriptsArray[0];

	scriptsCountAfterLoad = scriptsArray.length;
	equal(scriptsCountAfterLoad - scriptsCountBeforeLoad, 1, 'Script is inserted in head');
	equal(typeof insertedScript['onload'] === 'function', true, 'Script has onload handler assigned');
	equal(typeof insertedScript['onreadystatechange'] === 'function', true, 'Script has onreadystatechange handler assigned');
	equal(insertedScript['src'], 'scriptUrl', 'Script has correct url');
});

QUnit.module('Track', {
	setup: function () {
		this.tracker = new Mercury.Modules.Trackers.Internal();
		this.tracker.url = function() {};
		this.tracker.loadTrackingScript = sinon.spy();
		this.tracker.createRequestURL = sinon.spy();
	}
});

QUnit.test('test if track is calling right functions', function () {
	this.tracker.track({});
	ok(this.tracker.loadTrackingScript.called);
	ok(this.tracker.createRequestURL.called);
});
