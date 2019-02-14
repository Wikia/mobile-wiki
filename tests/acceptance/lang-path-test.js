import Service from '@ember/service';
import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';
import mockSearchTracking from '../helpers/mock-search-tracking';
import { mockAdsService } from '../helpers/mock-ads-service';
import mockSearchPageAdsContext from '../helpers/mock-search-page-ads-context';

const wikiUrlsServiceStub = Service.extend({
  langPath: '/pl',
});

module('Acceptance | lang path', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
    mockSearchTracking();
    mockSearchPageAdsContext(this.owner);

    this.owner.register('service:wiki-urls', wikiUrlsServiceStub);
  });

  test('visiting /pl/wiki/test', async (assert) => {
    const result = await visit('/pl/wiki/test');
    assert.ok(result);
    // Lang path is set as router's rootURL and it should be stripped
    assert.equal(currentURL(), '/wiki/test');
  });

  test('visiting /pl/search', async (assert) => {
    const result = await visit('/pl/search');
    assert.ok(result);
    assert.equal(currentURL(), '/search');
  });
});
