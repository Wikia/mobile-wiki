import {
  visit, click, fillIn, triggerKeyEvent, currentURL,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockAdsService from '../helpers/mock-ads-service';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';

module('Acceptance | search', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
  });

  test('submitting search form with Enter key shows search results', async (assert) => {
    await visit('/');

    const searchToggle = '.wds-global-navigation__search-toggle-icon';
    const searchInput = '.wds-global-navigation__search-input';
    const testQuery = 'test query';

    await click(searchToggle);
    await fillIn(searchInput, testQuery);
    await triggerKeyEvent(searchInput, 'keydown', 'Enter');

    assert.equal(currentURL(), '/search?query=test%20query');
  });

  test('visiting search result page with correct query displays search results', async (assert) => {
    await visit('/search?query=test%20query');

    assert.dom('.wikia-card').exists({ count: 4 });
    assert.dom('.wikia-card__title').hasText(
      'Result 1',
      'First title is correctly displayed',
    );
  });
});
