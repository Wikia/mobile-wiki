/* global resetWikiaBaseline */
module('Integration: Bootstrap Article from Preloaded Data', {
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
	setTimeout(function () {
	ok(content.match('Test content'),
		'Expected "Test content", received ' + content);
		start();
	}, 3000);
});
