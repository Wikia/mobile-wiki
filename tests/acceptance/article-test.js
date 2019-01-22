import { visit, click } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService, { getAdsModuleMock } from '../helpers/mock-ads-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';


module('Acceptance | Article page', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);

    adsModuleStub = sinon.stub(Ads, 'waitForAdEngine').returns({
      then: cb => cb(getAdsModuleMock({})),
    });
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
  });


  test('visiting Article Page', async (assert) => {
    await visit('/');
    await visit('/wiki/Qaga2');

    assert.dom('.wiki-page-header__title').exists();
    assert.dom('.wiki-page-header__title').hasText('Qaga2');
    assert.dom('.section-header-label').exists();
    assert.dom('#Test_1').doesNotHaveClass('open-section');

    await click('.section-header-label');
    assert.dom('#Test_1').hasClass('open-section');
  });
});
