module('Integration: Bootrap Article from Preloaded Data', {
	teardown: function () {
		App.reset();
	}
});

test('Article Preload', function () {
	visit('/w/foo/article/Bar');
	andThen(function () {
		ok(find('.article-content', $('#ember-testing')).text().match('Test content'), 'Content gets loaded correctly');
	});
});

// Don't think this will work because of when the page loads data. Argh.
// test('Article load', function () {
// 	stop();
// 	expect(1);
// 	console.log('before visit:' + Wikia._state.firstPage);
// 	visit('/w/lastofus/article/Ellie');
// 	setTimeout(function() {
// 		console.log($('.article-title'));
// 		console.log('after visit: ' + Wikia._state.firstPage);
// 		ok(find('.article-title').text().match('Ellie'), 'expected was Ellie, actual was ' + find('.article-title').text());
// 		start();
// 	}, 3000);
// });
