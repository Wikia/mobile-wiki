/* global App, resetMercuryBaseline*/
moduleFor('model:articleComments', 'Article Comments Model', {
	teardown: function () {
		App.reset();
		resetMercuryBaseline();
	}
});

test('url creates valid url to a resource', function () {
	expect(5);
	var model = this.subject();

	equal(model.url(1, 0), '/api/v1/article/comments/1/0');
	equal(model.url(1, 1), '/api/v1/article/comments/1/1');
	equal(model.url(1, 2), '/api/v1/article/comments/1/2');
	equal(model.url(5, 0), '/api/v1/article/comments/5/0');
	equal(model.url(90, 90), '/api/v1/article/comments/90/90');
});

test('reset, resets model properties', function () {
	expect(2);
	var model = this.subject(),
		data = {
			comments: 1,
			pagesCount: 34
		};

	model.setProperties(data);

	deepEqual(model.getProperties('comments', 'pagesCount'), data);

	model.reset();

	deepEqual(model.getProperties('comments', 'pagesCount'), {
		comments: 0,
		pagesCount: 0
	});

});
