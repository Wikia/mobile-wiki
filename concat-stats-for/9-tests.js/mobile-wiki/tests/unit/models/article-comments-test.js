define('mobile-wiki/tests/unit/models/article-comments-test', ['ember-qunit', 'sinon', 'require'], function (_emberQunit, _sinon, _require2) {
	'use strict';

	var stub = void 0;

	(0, _emberQunit.moduleFor)('model:article-comments', 'Unit | Model | article comments', {
		unit: true,

		beforeEach: function beforeEach() {
			stub = _sinon.default.stub((0, _require2.default)('mobile-wiki/utils/url'), 'buildUrl');
		},
		afterEach: function afterEach() {
			(0, _require2.default)('mobile-wiki/utils/url').buildUrl.restore();
		}
	});

	(0, _emberQunit.test)('url creates valid url to a resource', function (assert) {
		var model = this.subject();

		model.set('host', 'wikia.com');
		model.url(1, 1);
		assert.ok(stub.calledWith({
			host: 'wikia.com',
			path: '/wikia.php',
			query: {
				controller: 'MercuryApi',
				method: 'getArticleComments',
				id: 1,
				page: 1
			}
		}));
	});

	(0, _emberQunit.test)('reset, resets model properties', function (assert) {
		var model = this.subject(),
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
});