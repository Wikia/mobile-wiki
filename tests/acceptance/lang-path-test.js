import Service from '@ember/service';
import {find, findAll, fillIn, triggerEvent, visit, currentURL} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {module, test} from 'qunit';

const wikiUrlsServiceStub = Service.extend({
	langPath: '/pl'
});

module('Acceptance | lang path', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('service:wikiUrls', wikiUrlsServiceStub);
	});

	test('visiting /pl/wiki/test', async (assert) => {
		const result = await visit('/pl/wiki/test');
		assert.ok(result);
	});

	test('visiting /pl/search', async (assert) => {
		const result = await visit('/pl/search');
		assert.ok(result);
	});
});
