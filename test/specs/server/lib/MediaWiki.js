QUnit.module('lib/MediaWiki', {
	setup: function () {
		this.notFoundResponse = require('../../../fixtures/not-found.json');
	}
});

test('getDomainName', function () {
	expect(3);
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
});

test('ArticleRequest class', function () {
	equal(typeof global.ArticleRequest, 'function', 'be a constructor function');
});
