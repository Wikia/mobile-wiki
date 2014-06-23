QUnit.module('lib/MediaWiki');

test('ArticleRequest class', function () {
	var instance = new global.ArticleRequest();
	equal(typeof global.ArticleRequest, 'function', 'be a constructor function');
});
