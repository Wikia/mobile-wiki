/* global resetWikiaBaseline */
module('Integration: Bootrap Article from Preloaded Data', {
	setup: function () {
		Wikia.article.wikiName = 'lastofus';
	},
	teardown: function () {
		App.reset();
		resetWikiaBaseline();
	}
});

test('Article Preload', function () {
	visit('/a/Ellie');
	andThen(function () {
		var content = find('.article-content', '').text();
		ok(content.match('Test content'),
			'Expected "Test content", received ' + content);
	});
});


