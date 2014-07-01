moduleFor('model:article', 'Article Model', {
	setup: function () {
		// Test data for later tests
		var exampleArticleID = 123;
		this.example = Ember.Object.create({
			payload: {
				article: 'Test content'
			},
			articleTitle: 'sample title',
			articleDetails: {
				revision: {
					timestamp: 123
				},
				comments: ['one', 'two', 'three'],
				id: exampleArticleID,
				ns: 'namespace',
				title: 'sample title'
			},
			relatedPages: {
				items: ['an item', 'another item']
			},
			userDetails: {
				items: ['some item', 'yet one more']
			}
		});
		this.example.get('relatedPages.items')[exampleArticleID] = ['one', 'two', 'three'];
		// Preload data into Wikia.article
		Wikia.article = this.example;
	},
	teardown: function () {
		App.reset();
		resetWikiaBaseline();
	}
});

test('ArticleModel RESTful URL tests', function () {
	var tests = [{
		wiki: '',
		title: ''
	}, {
		wiki: 'foo',
		title: 'bar'
	}, {
		wiki: '',
		title: 'hippopotamus'
	}, {
		wiki: 'starwars',
		title: ''
	}];
	expect(tests.length);
	tests.forEach(function (test, index, array) {
		var url = App.ArticleModel.url(test);
		var expected = '/article/' + test.wiki + '/' + test.title;
		equal(url, expected, 'url returned"' + url + '", expected ' + expected);
	});
});

test('getPreloadedData test', function () {
	expect(2);
	// Already run in wikiaBaseline and the startup callback:
	// Wikia._state.firstPage = true;
	// Wikia.article = this.example;
	var article = App.ArticleModel.getPreloadedData();
	strictEqual(Wikia._state.firstPage, false, 'Wikia object\'s firstPage state flipped to false');
	deepEqual(article, Wikia.article, 'article loaded from Wikia object on first page');
});

test('test setArticle with preloaded data', function () {
	// Note: data preloaded in setup callback
	expect(11);
	var model = this.subject();
	App.ArticleModel.setArticle(model);
	// Necessary to set context
	verifyArticle(model, this.example);
});

test('test setArticle with parametrized data', function () {
	expect(11);
	var model = this.subject();
	App.ArticleModel.setArticle(model, this.example);
	verifyArticle(model, this.example);
});

test('test find with preloaded data', function () {
	expect(13);
	var params = {
		wiki: 'wiki',
		article: 'article'
	};
	ok(Wikia._state.firstPage, 'firstPage==true before test, as expected');
	Ember.run(function () {
		model = App.ArticleModel.find(params);
	});
	verifyArticle(model, this.example);
	ok(!Wikia._state.firstPage, 'firstPage==false after test, as expected');
});

/**
 * @desc Helper function for tests below which checks the validity of the data stored in the model
 * @param {model} The ArticleModel that data has been loaded into which should be tested
 * @param {example} The reference data
 */
function verifyArticle (model, example) {
	equal(model.get('type'),
		example.articleDetails.ns,
		'expected namespace=' + example.articleDetails.ns + ', got ' + model.get('type'));
	equal(model.get('cleanTitle'),
		example.articleDetails.title,
		'expected title=' + example.articleDetails.title + ', got ' + model.get('cleanTitle'));
	equal(model.get('comments'),
		example.articleDetails.comments,
		'correctly ingested comments');
	equal(model.get('id'),
		example.articleDetails.id,
		'expected article ID=' + example.articleDetails.id + ', got ' + model.get('id'));
	equal(model.get('article'),
		example.payload.article,
		'expected sample content=' + example.payload.article + ', got ' + model.get('article'));
	deepEqual(model.get('media'),
		example.payload.media,
		'expected media=' + example.payload.media + ', got ' + model.get('media'));
	equal(model.get('mediaUsers'),
		example.payload.users,
		'expected mediaUsers=' + example.payload.users + ', got ' + model.get('mediaUsers'));
	equal(model.get('user'),
		example.payload.user,
		'expected user=' + example.payload.user + ', got ' + model.get('user'));
	deepEqual(model.get('categories'),
		example.payload.categories,
		'expected categories=' + example.payload.categories + ', got ' + model.get('categories'));
	deepEqual(model.get('relatedPages'),
		example.relatedPages.items[example.articleDetails.id],
		'correction ingested related pages');
	deepEqual(model.users, example.userDetails.items, 'correctly ingested user items');
}
