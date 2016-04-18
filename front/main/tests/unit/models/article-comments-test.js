import {test, moduleFor} from 'ember-qunit';

moduleFor('model:article-comments', 'Unit | Model | article comments');

test('url creates valid url to a resource', function (assert) {
	const model = this.subject();

	assert.ok(model.url(1, 0).endsWith('/wikia.php?controller=MercuryApi&method=getArticleComments&id=1&page=0'));
	assert.ok(model.url(1, 1).endsWith('/wikia.php?controller=MercuryApi&method=getArticleComments&id=1&page=1'));
	assert.ok(model.url(1, 2).endsWith('/wikia.php?controller=MercuryApi&method=getArticleComments&id=1&page=2'));
	assert.ok(model.url(5, 0).endsWith('/wikia.php?controller=MercuryApi&method=getArticleComments&id=5&page=0'));
	assert.ok(model.url(90, 90).endsWith('/wikia.php?controller=MercuryApi&method=getArticleComments&id=90&page=90'));
});

test('reset, resets model properties', function (assert) {
	const model = this.subject(),
		data = {
			comments: 1,
			pagesCount: 34
		};

	model.setProperties(data);

	assert.deepEqual(model.getProperties('comments', 'pagesCount'), data);

	model.reset();

	assert.deepEqual(model.getProperties('comments', 'pagesCount'), {
		comments: 0,
		pagesCount: 0
	});
});
