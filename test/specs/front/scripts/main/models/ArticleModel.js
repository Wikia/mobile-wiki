/* global App, resetMercuryBaseline */
moduleFor('model:article', 'Article Model', {
	setup: function () {
		// Test data for later tests
		var exampleArticleID = 123;
		this.example = Ember.Object.create({
				details: {
					revision: {
						timestamp: 123
					},
					comments: 123,
					id: exampleArticleID,
					ns: 'namespace',
					title: 'sampleTitle'
				},
				article: {
					content: 'TestContent',
					categories: 'test',
					users: 'test'
				},
				relatedPages: ['anItem', 'anotherItem'],
				userDetails: ['someItem', 'yetOneMore']
			});

		this.wikiExample = {
			siteName: 'test',
			language: {
				content: 'en'
			}
		};

		// Preload data into Mercury.article
		Mercury.article = this.example;
		Mercury.wiki = this.wikiExample;
	},
	teardown: function () {
		App.reset();
		resetMercuryBaseline();
	}
});

test('ArticleModel RESTful URL tests', function () {
	var tests = [{
		title: ''
	}, {
		title: 'bar'
	}, {
		title: 'hippopotamus'
	}];
	expect(tests.length);
	tests.forEach(function (test) {
		var url = App.ArticleModel.url(test);
		var expected = '/api/v1/article/' + test.title;
		equal(url, expected, 'url returned"' + url + '", expected ' + expected);
	});
});

test('getPreloadedData', function () {
	// Already run in wikiaBaseline and the startup callback:
	// Mercury._state.firstPage = true;
	// Mercury.article = this.example;
	var article = Mercury.article,
		data = App.ArticleModel.getPreloadedData();

	strictEqual(M.prop('firstPage', false), false, 'Mercury object\'s firstPage state flipped to false');
	deepEqual(data, article, 'article loaded from Mercury object on first page');
	deepEqual(Mercury.article, undefined, 'Mercury.article is set to null');
});

test('setArticle with preloaded data', function () {
	// Note: data preloaded in setup callback
	var model = this.subject();
	App.ArticleModel.setArticle(model);
	// Necessary to set context
	verifyArticle(model, this.example, this.wikiExample);
});

test('setArticle with parametrized data', function () {
	var model = this.subject();
	App.ArticleModel.setArticle(model, this.example);
	verifyArticle(model, this.example);
});

test('find with preloaded data', function () {
	var model, params;

	params = {
		wiki: 'wiki',
		article: 'article'
	};

	ok(M.prop('firstPage'), 'firstPage==true before test, as expected');
	Ember.run(function () {
		model = App.ArticleModel.find(params);
	});
	verifyArticle(model, this.example, this.wikiExample);
	ok(!M.prop('firstPage'), 'firstPage==false after test, as expected');
});

/**
 * @desc Helper function for tests below which checks the validity of the data stored in the model
 * @param {model} The ArticleModel that data has been loaded into which should be tested
 * @param {example} The reference data
 */
function verifyArticle (model, example) {
	equal(model.get('ns'),
		example.details.ns,
		'expected namespace=' + example.details.ns + ', got ' + model.get('type'));
	equal(model.get('cleanTitle'),
		example.details.title,
		'expected title=' + example.details.title + ', got ' + model.get('cleanTitle'));
	equal(model.get('comments'),
		example.details.comments,
		'correctly ingested comments');
	equal(model.get('id'),
		example.details.id,
		'expected article ID=' + example.details.id + ', got ' + model.get('id'));
	equal(model.get('article'),
		example.article.content,
		'expected sample content=' + example.article.content + ', got ' + model.get('article'));
	equal(model.get('mediaUsers'),
		example.article.users,
		'expected mediaUsers=' + example.article.users + ', got ' + model.get('mediaUsers'));
	equal(model.get('user'),
		example.article.user,
		'expected user=' + example.article.user + ', got ' + model.get('user'));
	deepEqual(model.get('categories'),
		example.article.categories,
		'expected categories=' + example.article.categories + ', got ' + model.get('categories'));
	deepEqual(model.get('relatedPages'),
		example.relatedPages,
		'correction ingested related pages');
}
