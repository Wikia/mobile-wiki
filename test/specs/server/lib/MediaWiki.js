QUnit.module('lib/MediaWiki', {
	setup: function () {
		this.notFoundResponse = require('../../../fixtures/not-found.json');
	}
});

test('ArticleRequest class', function () {
	equal(typeof global.ArticleRequest, 'function', 'be a constructor function');
});

// May be better suited for integration testing
test('receives namespace info on call to wikiNamespace', function () {
	stop();
	expect(1);
	var request = new global.WikiRequest({
		name: 'starwars'
	});
	request.getWikiVariables().then(function (response) {
		ok(response,
			'received namespaces');
		start();
	});
});

