import { visit } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | Footer', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
  });
  test('check article footer', async (assert) => {
    await visit('/');
    await visit('/wiki/Qaga2');

    assert.dom('.wds-global-footer__header a').hasAttribute('title', 'Fandom powered by Wikia');
    assert.dom('.wds-global-footer__header-logo').exists();
    assert.dom('.wds-global-footer__links-list-item > a[href*="//fandom.wikia.com/games"]').exists();
    assert.dom('.wds-global-footer__links-list-item > a[href*="//fandom.wikia.com/movies"]').exists();
    assert.dom('.wds-global-footer__links-list-item > a[href*="//fandom.wikia.com/tv"]').exists();
    // assert.dom('.wds-global-footer__bottom-bar-row a[href*="Licensing"]').exists();
    assert.dom('.global-footer-bottom__bar > div[role="button"]')
      .hasText('global-footer-full-site-link');
  });
});
