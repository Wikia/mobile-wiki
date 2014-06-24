QUnit.module('lib/MediaWiki');

test('Common functions', function () {
	global.localSettings.environment = 'dev';
	equal(global.createUrl('foo', 'api/test', {
		title: 'bar'
	}), 'http://foo.kenneth.wikia-dev.com/api/test?title=bar', 'createUrl should return right url');
});

test('ArticleRequest class', function () {
	var instance = new global.ArticleRequest({
		name: 'foo',
		title: 'bar'
	});
	equal(typeof global.ArticleRequest, 'function', 'be a constructor function');
});
