import {
  click, currentURL, visit,
} from '@ember/test-helpers';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import { getAdsModuleMock, mockAdsService, adEngineMock } from '../helpers/mock-ads-service';

module('Acceptance | category page', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;
  let oldAdEngine;

  hooks.beforeEach(async function () {
    oldAdEngine = window.Wikia.adEngine || {};

    window.Wikia.adEngine = adEngineMock;

    mockFastbootService(this.owner);
    mockAdsService(this.owner);

    adsModuleStub = sinon.stub(Ads, 'getLoadedInstance').returns(Promise.resolve(getAdsModuleMock({})));
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
  });

  test('visiting Category Page', async (assert) => {
    await visit('/');
    await visit('/wiki/Category:Blog_post_images');

    assert.equal(currentURL(), '/wiki/Category:Blog_post_images');

    assert.dom('.article-content').hasText('Category article content', 'Article content is visible');

    assert.dom('.category-trending-pages__header').exists('Trending pages header is visible');
    assert.dom('.category-trending-pages__list').exists('Trending pages list is visible');
    assert.dom('.category-trending-pages__item-thumbnail')
      .hasAttribute(
        'data-src',
        'https://vignette.wikia.nocookie.net/fallout/images/e/e4/Fo4-sleep-map.jpg/revision/latest/top-crop/width/180/height/135?cb=20160521193225',
        'Trending page thumbnail is cropped',
      );
    assert.dom('.category-alphabet-shortcuts__item').exists({ count: 28 }, 'Alphabet shortcuts are visible');
    assert.dom('.category-members-grouped__first-char').exists({ count: 11 }, 'First char headers are visible');
    assert.dom('.category-members-grouped__members-for-char').exists({ count: 11 }, 'Category groups are visible');
    assert.dom('.category-members-grouped__member').exists({ count: 200 }, '200 members are visible');

    await click('.category-members-grouped__first-char');
    assert.dom('.category-members-grouped__members-for-char').isNotVisible('Group is collapsed on header click');

    assert.dom('.category-pagination a').exists({ count: 2 }, '2 pagination links are visible');

    await click('.category-pagination__next');
    assert.equal(currentURL(), '/wiki/Category:Blog_post_images?from=BethblogTofthemonthJuly.jpg');
    assert.dom('.category-members-grouped__member-link').hasText('BethblogTofthemonthJuly.jpg', 'Second batch of members is visible');
    assert.dom('.category-pagination a').exists({ count: 3 }, '3 pagination links are visible');
  });
});
