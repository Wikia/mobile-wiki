import Service from '@ember/service';
import { currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';
import Ads from 'mobile-wiki/modules/ads';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';
import mockSearchTracking from '../helpers/mock-search-tracking';
import { mockAdsService, getAdsModuleMock, adEngineMock } from '../helpers/mock-ads-service';
import mockSearchPageAdsContext from '../helpers/mock-search-page-ads-context';

const wikiUrlsServiceStub = Service.extend({
  langPath: '/pl',
});

let adsModuleStub;
let oldAdEngine;

module('Acceptance | lang path', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    oldAdEngine = window.Wikia.adEngine || {};

    window.Wikia.adEngine = adEngineMock;
    adsModuleStub = sinon.stub(Ads, 'getLoadedInstance').returns(Promise.resolve(getAdsModuleMock({})));

    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
    mockSearchTracking();
    mockSearchPageAdsContext(this.owner);

    this.owner.register('service:wiki-urls', wikiUrlsServiceStub);
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
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
