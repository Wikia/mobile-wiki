QUnit.module('lib/MediaWiki');

test('createURL', function () {
	global.localSettings.environment = 'dev';
	equal(global.createUrl('foo', 'api/test', { }),
		'http://foo.kenneth.wikia-dev.com/api/test', 'zero query params');
	equal(global.createUrl('foo', 'api/test', {
		title: 'bar'
	}), 'http://foo.kenneth.wikia-dev.com/api/test?title=bar', 'one query param');
	equal(global.createUrl('foo', 'api/test',{
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.kenneth.wikia-dev.com/api/test?title=bar&param=gibberish', 'two query params');
});

test('ArticleRequest class', function () {
	var instance = new global.ArticleRequest({
		name: 'foo',
		title: 'bar'
	});
	equal(typeof global.ArticleRequest, 'function', 'be a constructor function');
});

// test('receives article content on fetch', function () {
// 	// console.log(global);

// 	stop();
// 	expect(1);
// 	var request = new global.ArticleRequest({
// 		name: 'lastofus',
// 		title: 'Ellie'
// 	});
// 	request.article().then(function(response) {
// 		// console.log(response);
// 		ok(response.payload.article.length > 0, 'article length is nonzero');
// 		start();
// 	});
// });

test('receives error message on invalid fetch', function () {
	stop();
	expect(1);
	var request = new global.ArticleRequest({
		name: "alsjdflkajsdlfjasd",
		title: "ckx,.,,eeeee;;;ooOOOOO"
	});
	// Note that this does not robustly test the request, it only checks that if all else
	// is good, then if the wiki name and article title are bad then we get the response
	// we expect
	request.article().then(function(response) {
		deepEqual(response,
			require('../../../fixtures/not-found.json'),
			'gets error on bad article request')
	});
});
