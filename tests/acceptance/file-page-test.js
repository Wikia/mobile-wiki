import {
  currentURL, visit,
} from '@ember/test-helpers';
import { test, module } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';
import mockFastbootService from '../helpers/mock-fastboot-service';
import { mockAdsService, adEngineMock, mockAdsInstance } from '../helpers/mock-ads-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';

module('Acceptance | file page', (hooks) => {
  setupApplicationTest(hooks);

  const originalImage = window.Image;

  let adsModuleStub;
  let oldAdEngine;

  hooks.beforeEach(function () {
    oldAdEngine = window.Wikia.adEngine || {};

    window.Wikia.adEngine = adEngineMock;

    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
    window.Image = sinon.stub();

    adsModuleStub = mockAdsInstance();
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
    window.Image = originalImage;
  });

  test('visiting File Page', async (assert) => {
    await visit('/');
    await visit('/wiki/File:Example.jpg');

    assert.equal(currentURL(), '/wiki/File:Example.jpg');
    assert.dom('.article-media-thumbnail img').exists('Hero image is visible');
    assert.dom('.file-usage__header').exists('Appears on header is visible');
    assert.dom('.file-usage__more a').exists('Appears on see more link is visible');
    assert.dom('.file-usage__more a').hasAttribute('href', '/wiki/Special:WhatLinksHere/File:Example.jpg');
    assert.dom('.wikia-card').exists();
  });
});
