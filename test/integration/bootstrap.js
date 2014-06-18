module('Integration: Bootrap Article from Preloaded Data', {
	teardown: function () {
		App.reset();
	}
});

test('foo', function () {
	visit('/w/foo/article/Bar');
	andThen(function () {
		ok(find('.article-content', '').text().match('Test content'), 'Content gets loaded correctly');
	});
});


