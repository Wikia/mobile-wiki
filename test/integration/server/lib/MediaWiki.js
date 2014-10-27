QUnit.module('lib/MediaWiki', {
	setup: function () {
		this.notFoundResponse = require('../../../fixtures/not-found.json');
	}
});

test('getDomainName', function () {
	expect(3);
	global.localSettings.environment = 'dev';
	equal(global.getDomainName('foo'),
		'http://foo.kenneth.wikia-dev.com/',
		'dev URL has correct output');
	global.localSettings.environment = 'sandbox';
	global.localSettings.host = 'hoest';
	equal(global.getDomainName('foo'),
		'http://hoest.foo.wikia.com/',
		'sandbox URL has correct output');
	global.localSettings.environment = 'prod';
	equal(global.getDomainName('foo'),
		'http://foo.wikia.com/',
		'production URL has correct output');
});

test('createURL', function () {
	global.localSettings.environment = 'dev';
	equal(global.createUrl('foo', 'api/test'),
		'http://foo.kenneth.wikia-dev.com/api/test', 'zero query params');
	equal(global.createUrl('foo', 'api/test', {
		title: 'bar'
	}), 'http://foo.kenneth.wikia-dev.com/api/test?title=bar', 'one query param');
	equal(global.createUrl('foo', 'api/test',{
		title: 'bar',
		param: 'gibberish'
	}), 'http://foo.kenneth.wikia-dev.com/api/test?title=bar&param=gibberish', 'two query params');
});

test('receives article content on fetch', function () {
	stop();
	expect(1);
	var request = new global.ArticleRequest({
		name: 'starwars',
		title: 'Chewbacca'
	});
	request.fetch().then(function (response) {
		ok(response.article &&
			response.article.content,
			'received article');
		start();
	});
});

test('receives error message on invalid ArticleRequest', function () {
	var self = this;
	stop();
	expect(1);
	var request = new global.ArticleRequest({
		name: 'alsjdflkajsdlfjasd',
		title: 'ckxoOOOOO'
	});
	// Note that this does not robustly test the request, it only checks that if all else
	// is good, then if the wiki name and article title are bad then we get the response
	// we expect
	request.fetch().then(function (response) {
		deepEqual(response,
			self.notFoundResponse,
			'gets error on bad article request');
		start();
	});
});
