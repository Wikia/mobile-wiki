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
	stop();
	visit('/a/Ellie');
	var content = find('.article-content', '').text();
	ok(content.match('Test content'),
		'Expected "Test content", received ' + content);
	setTimeout(function () {
		start();
	}, 3000);
});


