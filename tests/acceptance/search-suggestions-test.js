import {module, test} from 'qunit';
import {visit, currentURL, click, fillIn} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | search suggestions', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('open search suggestions and navigate to first suggestion', async (assert) => {
		await visit('/');

		await click('[data-test-open-search-suggestions]');
		await fillIn('[data-test-suggestions-input]', 'test');

		assert.dom('[data-test-suggestion-link="0"]').exists();

		await click('[data-test-suggestion-link="0"]');

		assert.dom('[data-test-article-content]').hasText('TestA');
		assert.dom('.wikia-search-wrapper').doesNotExist();
	});
});
