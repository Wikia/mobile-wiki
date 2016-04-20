import {test, moduleFor} from 'ember-qunit';
import sinon from 'sinon';

let stub;

moduleFor('model:article-comments', 'Unit | Model | article comments', {
	unit: true,

	beforeEach() {
		stub = sinon.stub(M, 'buildUrl');
	},

	afterEach() {
		M.buildUrl.restore();
	}
});

test('url creates valid url to a resource', function (assert) {
	const model = this.subject();

	model.url(1, 1);
	assert.ok(stub.calledWith({
		path: '/wikia.php',
		query: {
			controller: 'MercuryApi',
			method: 'getArticleComments',
			id: 1,
			page: 1
		}
	}));
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
