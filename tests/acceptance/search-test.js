import {
  visit, click, fillIn, triggerKeyEvent, currentURL,
} from '@ember/test-helpers';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { mockAdsService, adEngineMock, getAdsModuleMock } from '../helpers/mock-ads-service';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockRuntimeConfigService from '../helpers/mock-runtime-config-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';
import mockSearchTracking from '../helpers/mock-search-tracking';
import mockSearchPageAdsContext from '../helpers/mock-search-page-ads-context';

module('Acceptance | search', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;
  let oldAdEngine;

  hooks.beforeEach(function () {
    oldAdEngine = window.Wikia.adEngine || {};

    window.Wikia.adEngine = adEngineMock;
    adsModuleStub = sinon.stub(Ads, 'waitForAdEngine').returns({
      then: cb => cb(getAdsModuleMock()),
    });
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
    mockSearchTracking();
    mockSearchPageAdsContext(this.owner);
    mockRuntimeConfigService(this.owner);
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
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
      'Destiny',
      'First title is correctly displayed',
    );
  });
});
