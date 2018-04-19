import Service from '@ember/service';
import {find, findAll, fillIn, triggerEvent, visit, currentURL} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {module, test} from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';

const wikiUrlsServiceStub = Service.extend({
	langPath: '/pl'
});

module('Acceptance | lang path', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
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
