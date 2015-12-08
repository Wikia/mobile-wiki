moduleFor('model:curatedContent', 'CuratedContentModel', {
	setup: function () {
		Mercury.wiki.articlePath = '/wiki/';
	}
});

test('sanitizes sections', function () {
	deepEqual(App.CuratedContentModel.sanitizeItem({
		title: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'section'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'section'
	});
});

test('sanitizes categories', function () {
	deepEqual(App.CuratedContentModel.sanitizeItem({
		label: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'category',
		article_local_url: '/wiki/Category:CategoryName'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'category',
		categoryName: 'CategoryName'
	});

	deepEqual(App.CuratedContentModel.sanitizeItem({
		title: 'Title',
		image_url: 'http://vignette/image.jpg',
		type: 'category',
		url: '/wiki/Category:CategoryName'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'category',
		categoryName: 'CategoryName'
	});
});

test('sanitizes other items', function () {
	deepEqual(App.CuratedContentModel.sanitizeItem({
		title: 'Title',
		thumbnail: 'http://vignette/image.jpg',
		type: 'article',
		url: '/wiki/Article'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'article',
		url: '/wiki/Article'
	});

	deepEqual(App.CuratedContentModel.sanitizeItem({
		title: 'Title',
		thumbnail: 'http://vignette/image.jpg',
		ns: 500,
		url: '/wiki/Blog:Post'
	}), {
		label: 'Title',
		imageUrl: 'http://vignette/image.jpg',
		type: 'blog',
		url: '/wiki/Blog:Post'
	});
});

