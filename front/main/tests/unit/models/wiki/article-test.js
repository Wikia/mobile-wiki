import Ember from 'ember';
import {test, moduleFor} from 'ember-qunit';

const articleExample = {
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
	articleModelClass = require('main/models/wiki/article').default;


/**
 * @desc Helper function for tests below which checks the validity of the data stored in the model
 * @param {Object} model The ArticleModel that data has been loaded into which should be tested
 * @param {Object} article The reference data
 * @param {{equal: function, deepEqual: function}} assert
 *
 * @returns {void}
 */
function verifyArticle(model, article, assert) {
	const articleData = article.data;

	assert.equal(
		model.get('ns'),
		articleData.details.ns,
		`expected namespace=${articleData.details.ns}, got ${model.get('type')}`
	);

	assert.equal(
		model.get('displayTitle'),
		articleData.details.title,
		`expected title=${articleData.details.title}, got ${model.get('displayTitle')}`
	);

	assert.equal(
		model.get('comments'),
		articleData.details.comments,
		'correctly ingested comments'
	);

	assert.equal(
		model.get('id'),
		articleData.details.id,
		`expected article ID=${articleData.details.id}, got ${model.get('id')}`
	);

	assert.equal(
		model.get('content'),
		articleData.article.content,
		`expected content=${articleData.article.content}, got ${model.get('content')}`
	);

	assert.equal(
		model.get('mediaUsers'),
		articleData.article.users,
		`expected mediaUsers=${articleData.article.users}, got ${model.get('mediaUsers')}`
	);

	assert.equal(
		model.get('user'),
		articleData.article.user,
		`expected user=${articleData.article.user}, got ${model.get('user')}`
	);

	assert.deepEqual(
		model.get('categories'),
		articleData.article.categories,
		`expected categories=${articleData.article.categories}, got ${model.get('categories')}`
	);

	assert.deepEqual(
		model.get('relatedPages'),
		articleData.relatedPages,
		'correction ingested related pages'
	);
}

moduleFor('model:wiki/article', 'Integration | Model | wiki/article', {
	beforeEach() {
		M.provide('article', articleExample);
		M.prop('articleContentPreloadedInDOM', true, true);

		Ember.$('#ember-testing').html('<div class="article-content" id="preloadedContent">Test content</div>');
	},

	afterEach() {
		Ember.$('#ember-testing').html('');
	}
});

test('getPreloadedData', (assert, undef) => {
	const articleFromPreloadedData = articleModelClass.getPreloadedData();

	assert.strictEqual(
		M.prop('articleContentPreloadedInDOM'),
		false,
		'Mercury object\'s articleContentPreloadedInDOM state flipped to false'
	);

	assert.deepEqual(articleFromPreloadedData, articleExample, 'article loaded from Mercury object on first page');
	assert.deepEqual(M.article, undef, 'Mercury.article is deleted');
});

test('setArticle with preloaded data', function (assert) {
	const model = this.subject();

	articleModelClass.setArticle(model);
	verifyArticle(model, articleExample, assert);
});

test('setArticle with parametrized data', function (assert) {
	const model = this.subject();

	articleModelClass.setArticle(model, articleExample);
	verifyArticle(model, articleExample, assert);
});
