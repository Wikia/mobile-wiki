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

test('receives article content on fetch', function () {
	stop();
	expect(1);
	var request = new global.ArticleRequest({
		name: 'lastofus',
		title: 'Ellie'
	});
	request.article().then(function(response) {
		console.log(response);
		ok(response.payload.article.length > 0, 'article length is nonzero');
		start();
	});
});
