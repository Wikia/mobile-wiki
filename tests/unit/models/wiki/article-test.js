import {test, moduleFor} from 'ember-qunit';

const articleExample = {
	data: {
		details: {
			revision: {
				timestamp: 123
			},
			comments: 123,
			id: 123
		},
		categories: 'test',
		article: {
			content: 'TestContent',
			users: 'test'
		},
		ns: 'namespace',
		userDetails: ['someItem', 'yetOneMore']
	}
};

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
		articleData.ns,
		`expected namespace=${articleData.details.ns}, got ${model.get('ns')}`
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
		articleData.categories,
		`expected categories=${articleData.categories}, got ${model.get('categories')}`
	);
}

moduleFor('model:wiki/article', 'Integration | Model | wiki/article', {
	needs: [
		'service:wiki-variables'
	],
});

test('setData with parametrized data', function (assert) {
	const model = this.subject();

	model.setData(articleExample);
	verifyArticle(model, articleExample, assert);
});
