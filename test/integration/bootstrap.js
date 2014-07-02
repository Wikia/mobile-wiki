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
		ok(find('.article-content', '').text().match('Test content'), 'Content gets loaded correctly');
	});
});


