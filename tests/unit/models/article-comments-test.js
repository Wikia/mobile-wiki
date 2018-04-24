import {module, test} from 'qunit';
import Service from '@ember/service';
import {setupTest} from 'ember-qunit';
import sinon from 'sinon';
import {run} from '@ember/runloop';

let wikiUrlsBuildStub;

const wikiUrlsServiceStub = Service.extend({
	build() {}
});

module('Unit | Model | article comments', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('service:wikiUrls', wikiUrlsServiceStub);
		const wikiUrlsService = this.owner.lookup('service:wikiUrls');
		wikiUrlsBuildStub = sinon.stub(wikiUrlsService, 'build');
	});

	hooks.afterEach(() => {
		wikiUrlsBuildStub.restore();
	});

	test('url creates valid url to a resource', function (assert) {
		const model = this.owner.factoryFor('model:article-comments').create();

		model.set('host', 'wikia.com');
		model.url(1, 1);
		assert.ok(wikiUrlsBuildStub.calledWith({
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
		const model = this.owner.factoryFor('model:article-comments').create(),
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
