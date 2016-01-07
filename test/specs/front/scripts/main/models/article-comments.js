moduleFor('model:article-comments', 'ArticleCommentsModel');

test('url creates valid url to a resource', function () {
	var model = this.subject();

	equal(model.url(1, 0), '/api/mercury/article/comments/1/0');
	equal(model.url(1, 1), '/api/mercury/article/comments/1/1');
	equal(model.url(1, 2), '/api/mercury/article/comments/1/2');
	equal(model.url(5, 0), '/api/mercury/article/comments/5/0');
	equal(model.url(90, 90), '/api/mercury/article/comments/90/90');
});

test('reset, resets model properties', function () {
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
