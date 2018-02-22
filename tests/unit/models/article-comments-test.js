import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import sinon from 'sinon';
import require from 'require';

import {run} from '@ember/runloop';

let stub;

module('Unit | Model | article comments', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		stub = sinon.stub(require('mobile-wiki/utils/url'), 'buildUrl');
	});

	hooks.afterEach(() => {
		require('mobile-wiki/utils/url').buildUrl.restore();
	});

	test('url creates valid url to a resource', function (assert) {
		const model = run(() => this.owner.lookup('service:store').createRecord('article-comments'));

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

	test('reset, resets model properties', function (assert) {
		const model = run(() => this.owner.lookup('service:store').createRecord('article-comments')),
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
