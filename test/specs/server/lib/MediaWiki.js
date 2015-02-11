QUnit.module('lib/MediaWiki', {
	setup: function () {
		this.notFoundResponse = require('../../../fixtures/not-found.json');
	}
});

test('createURL', function () {
	global.localSettings.environment = 'dev';
	global.localSettings.devboxDomain = 'test';
	global.localSettings.mediawikiDomain = undefined;

	equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', { }),
		'http://foo.test.wikia-dev.com/api/test', 'zero query params');
	equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', {
		title: 'bar'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar', 'one query param');
	equal(global.createUrl('foo.test.wikia-dev.com', 'api/test',{
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.test.wikia-dev.com/api/test?title=bar&param=gibberish', 'two query params');
	equal(global.createUrl('foo.test.wikia-dev.com', 'api/test'),
		'http://foo.test.wikia-dev.com/api/test', 'missing query params');

	global.localSettings.mediawikiDomain = 'mediawiki.service.consul';
	equal(global.createUrl('foo.test.wikia-dev.com', 'api/test', { }),
		'http://mediawiki.service.consul/api/test', 'consul url rewrite');
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
