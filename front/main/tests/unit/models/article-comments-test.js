import {test, moduleFor} from 'ember-qunit';

moduleFor('model:article-comments', 'Unit | Model | article comments');

test('url creates valid url to a resource', function (assert) {
	const model = this.subject();

	assert.equal(model.url(1, 0), '/api/mercury/article/comments/1/0');
	assert.equal(model.url(1, 1), '/api/mercury/article/comments/1/1');
	assert.equal(model.url(1, 2), '/api/mercury/article/comments/1/2');
	assert.equal(model.url(5, 0), '/api/mercury/article/comments/5/0');
	assert.equal(model.url(90, 90), '/api/mercury/article/comments/90/90');
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
