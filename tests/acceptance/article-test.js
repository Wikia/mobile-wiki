import { visit, click } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import mockFastbootService from '../helpers/mock-fastboot-service';
import { getAdsModuleMock, mockAdsService } from '../helpers/mock-ads-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';


module('Acceptance | Article page', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;

  hooks.beforeEach(async function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);

    adsModuleStub = sinon.stub(Ads, 'waitForAdEngine').returns({
      then: cb => cb(getAdsModuleMock({})),
    });

    await visit('/');
    await visit('/wiki/Qaga2');
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
  });


  test('should have correct title', async (assert) => {
    assert.dom('.wiki-page-header__title').exists();
    assert.dom('.wiki-page-header__title').hasText('Qaga2');
  });

  test('should start with uncollapsed sections', async (assert) => {
    assert.dom('.section-header-label').exists();
    assert.dom('#Test_1').hasClass('open-section');
  });

  test('should collapse section when clicked on section header', async (assert) => {
    await click('.section-header-label');
    assert.dom('#Test_1').doesNotHaveClass('open-section');
  });
});
