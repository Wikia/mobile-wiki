var articleExample = {
		data: {
			details: {
				revision: {
					timestamp: 123
				},
				comments: 123,
				id: 123,
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
		}
	},
	articleModelClass = mrequire('main/models/article').default;

moduleFor('model:article', 'ArticleModel', {
	setup: function () {
		M.provide('article', articleExample);
		M.prop('articleContentPreloadedInDOM', true, true);
		document.write('<div class="article-content" id="preloadedContent">Test content</div><div id="ember-testing"></div>');
	},

	teardown: function () {
		var contentElement = document.getElementById('preloadedContent');
		contentElement.parentNode.removeChild(contentElement);
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

	tests.forEach(function (test) {
		var url = articleModelClass.url(test),
			expected = '/api/mercury/article/' + test.title;

		equal(url, expected, 'url returned: "' + url + '", expected: "' + expected + '"');
	});
});

test('getPreloadedData', function () {
	var articleFromPreloadedData = articleModelClass.getPreloadedData();

	strictEqual(
		M.prop('articleContentPreloadedInDOM'),
		false,
		'Mercury object\'s articleContentPreloadedInDOM state flipped to false'
	);

	deepEqual(articleFromPreloadedData, articleExample, 'article loaded from Mercury object on first page');
	deepEqual(M.article, undefined, 'Mercury.article is deleted');
});

test('setArticle with preloaded data', function () {
	var model = this.subject();

	articleModelClass.setArticle(model);
	verifyArticle(model, articleExample);
});

test('setArticle with parametrized data', function () {
	var model = this.subject();

	articleModelClass.setArticle(model, articleExample);
	verifyArticle(model, articleExample);
});

test('find with preloaded data', function () {
	var model,
		params = {
			wiki: 'wiki',
			article: 'article'
		};

	ok(M.prop('articleContentPreloadedInDOM'), 'articleContentPreloadedInDOM==true before test, as expected');

	Ember.run(function () {
		model = articleModelClass.find(params);
	});

	model.then(function (resolvedModel) {
		verifyArticle(resolvedModel, articleExample);
	});

	ok(!M.prop('articleContentPreloadedInDOM'), 'articleContentPreloadedInDOM==false after test, as expected');
});

/**
 * @desc Helper function for tests below which checks the validity of the data stored in the model
 * @param model The ArticleModel that data has been loaded into which should be tested
 * @param article The reference data
 */
function verifyArticle(model, article) {
	var articleData = article.data;

	equal(
		model.get('ns'),
		articleData.details.ns,
		'expected namespace=' + articleData.details.ns + ', got ' + model.get('type')
	);

	equal(
		model.get('cleanTitle'),
		articleData.details.title,
		'expected title=' + articleData.details.title + ', got ' + model.get('cleanTitle')
	);

	equal(
		model.get('comments'),
		articleData.details.comments,
		'correctly ingested comments'
	);

	equal(
		model.get('id'),
		articleData.details.id,
		'expected article ID=' + articleData.details.id + ', got ' + model.get('id')
	);

	equal(
		model.get('content'),
		articleData.article.content,
		'expected content=' + articleData.article.content + ', got ' + model.get('content')
	);

	equal(
		model.get('mediaUsers'),
		articleData.article.users,
		'expected mediaUsers=' + articleData.article.users + ', got ' + model.get('mediaUsers')
	);

	equal(
		model.get('user'),
		articleData.article.user,
		'expected user=' + articleData.article.user + ', got ' + model.get('user')
	);

	deepEqual(
		model.get('categories'),
		articleData.article.categories,
		'expected categories=' + articleData.article.categories + ', got ' + model.get('categories')
	);

	deepEqual(
		model.get('relatedPages'),
		articleData.relatedPages,
		'correction ingested related pages'
	);
}
