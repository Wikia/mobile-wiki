import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockAdsService from '../helpers/mock-ads-service';
import mockFastbootService from '../helpers/mock-fastboot-service';

module('Acceptance | search', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
  });

  test('visiting search result page with correct query displays search results', async (assert) => {
    await visit('/search?query=test%20query');

    assert.dom('.search-results__list .wikia-card').exists({ count: 4 });
    assert.dom('.search-results__list .wikia-card__title').hasText(
      'Result 1',
      'First title is correctly displayed',
    );
  });
});
