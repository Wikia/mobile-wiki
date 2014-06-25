QUnit.module('lib/MediaWiki', {
	// setup: function () {
	// 	this.oldGet = Nipple.get;
	// 	// Written to match the way MediaWiki.fetch() calls it.
	// 	Nipple.get = function (uri, options, callback) {
	// 		if (url == 'http://foo.kenneth.wikia-dev.com/api/test?title=bar') {
	// 			var data = require('../../fixtures/valid-response.json');
	// 			var res = {
	// 				headers: {
	// 					'content-type':'applications/json'
	// 				},
	// 				payload: data
	// 			};
	// 			callback({}, res, payload);
	// 		} else {
	// 			var err = require('../../not-found.json');
	// 			callback(err);
	// 		}
	// 	};
	// },
	// teardown: function () {
	// 	Nipple.get = this.oldGet;
	// }
});

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

test('receives article content on fetch', function () {
	// console.log(global);

	stop();
	expect(1);
	var request = new global.ArticleRequest({
		name: 'lastofus',
		title: 'Ellie'
	});
	request.article().then(function(response) {
		// console.log(response);
		ok(response.payload.article.length > 0, 'article length is nonzero');
		start();
	});
});

test('receives error message on invalid fetch', function () {

});
