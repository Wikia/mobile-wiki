import { visit } from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import { mockAdsService, adEngineMock, mockAdsInstance } from '../helpers/mock-ads-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';

module('Acceptance | Blog post page', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;
  let oldAdEngine;

  hooks.beforeEach(async function () {
    oldAdEngine = window.Wikia.adEngine;

    window.Wikia.adEngine = adEngineMock;

    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);

    adsModuleStub = mockAdsInstance();
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
  });

  test('blog post contains categories', async (assert) => {
    await visit('/');
    await visit('/wiki/User_blog:TimmyQuivy/Bots:_An_Overview_Of_How_They_Are_Used_on_FANDOM');

    assert.dom('.wiki-page-header__title').exists();
    assert.dom('.wiki-page-header__title').hasText('Test title for blog page');
    assert.dom('.wiki-page-header__subtitle').exists();
    assert.dom('.wiki-page-header__subtitle').hasText('blog-page.subtitle');
    assert.dom('.article-content').hasText('Test content on blog page');
    assert.dom('.article-categories-list.collapsible-menu').exists();
    assert.dom('.article-categories-list.collapsible-menu li').exists({ count: 2 }, 'Categories section has 2 items');
  });
});
