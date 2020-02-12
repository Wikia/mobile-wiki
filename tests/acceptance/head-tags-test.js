import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import { mockAdsService, adEngineMock, mockAdsInstance } from '../helpers/mock-ads-service';
import mockFastlyInsights from '../helpers/mock-fastly-insights';

module('Acceptance | Head meta tags', (hooks) => {
  setupApplicationTest(hooks);

  let adsModuleStub;
  let oldAdEngine;

  hooks.beforeEach(function () {
    oldAdEngine = window.Wikia.adEngine || {};

    window.Wikia.adEngine = adEngineMock;
    adsModuleStub = mockAdsInstance();

    mockFastbootService(this.owner);
    mockAdsService(this.owner);
    mockFastlyInsights(this.owner);
  });

  hooks.afterEach(() => {
    adsModuleStub.restore();
    window.Wikia.adEngine = oldAdEngine;
  });

  test('check twitter meta tags', async (assert) => {
    await visit('/wiki/File:Example.jpg');

    assert.equal(
      document.querySelector('meta[name="twitter:card"]').getAttribute('content'),
      'summary',
    );

    assert.equal(
      document.querySelector('meta[name="twitter:site"]').getAttribute('content'),
      '@getfandom',
    );

    assert.equal(
      document.querySelector('meta[name="twitter:url"]').getAttribute('content'),
      'http://fallout.wikia.com/wiki/File:Example.jpg',
    );

    assert.equal(
      document.querySelector('meta[name="twitter:title"]').getAttribute('content'),
      'Image - Example.jpg | Fallout Wiki | FANDOM',
    );

    assert.equal(
      document.querySelector('meta[name="twitter:description"]').getAttribute('content'),
      'Licensing This file was taken from the video game Fallout: New Vegas or from websites created...',
    );
  });
});
