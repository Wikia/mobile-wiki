QUnit.module('lib/MediaWiki', {
	setup: function () {
		this.notFoundResponse = require('../../../fixtures/not-found.json');
	}
});

test('getDomainName', function (assert) {
	expect(5);
	delete(global.localSettings.environment);
	assert.throws(function() {
		global.getDomainName('foo')
	}, 'Environment not set');
	global.localSettings.environment = 'dev';
	global.localSettings.mediawikiHost = 'test';

	equal(global.getDomainName('foo'),
		'http://foo.test.wikia-dev.com/',
		'dev URL has correct output');
	global.localSettings.environment = 'sandbox';
	global.localSettings.host = 'hoest';

	equal(global.getDomainName('foo'),
		'http://hoest.foo.wikia.com/',
		'sandbox URL has correct output');
	global.localSettings.environment = 'production';
	equal(global.getDomainName('foo'),
		'http://foo.wikia.com/',
		'production URL has correct output');
	equal(global.getDomainName(),
		'http://wikia.com/',
		'handles missing url');
});

test('createURL', function () {
	global.localSettings.environment = 'dev';
	global.localSettings.mediawikiHost = 'test';

	equal(global.createUrl('foo', 'api/test', { }),
		'http://foo.test.wikia-dev.com/api/test', 'zero query params');
	equal(global.createUrl('foo', 'api/test', {
		title: 'bar'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar', 'one query param');
	equal(global.createUrl('foo', 'api/test',{
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar&param=gibberish', 'two query params');
	equal(global.createUrl('foo', 'api/test'),
		'http://foo.test.wikia-dev.com/api/test', 'missing query params');
});

test('Constructors', function () {
	var testCases = [
		{
			name: 'ArticleRequest',
			data: {
				title: 'title',
				name: 'name'
			}
		} , {
			name: 'WikiRequest',
			data: {
				name: 'name'
			}
		} , {
			name: 'SearchRequest',
			data: {
				name: 'name'
			}
		}
	];
	testCases.forEach(function (testCase) {
		equal(typeof global[testCase.name], 'function', testCase.name + ' be a function');
		equal(typeof new global[testCase.name](testCase.data), 'object', testCase.name + ' be a constructor function');
	});
});
