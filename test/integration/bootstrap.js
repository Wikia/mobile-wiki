module('Integration: Bootrap Article from Preloaded Data', {
	teardown: function () {
		App.reset();
		wikiaBaseline();
	}
});

test('Article Preload', function () {
	visit('/w/lastofus/article/Ellie');
	andThen(function () {
		ok(find('.article-content', '').text().match('Test content'), 'Content gets loaded correctly');
	});
});


