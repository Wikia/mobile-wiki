import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | Head meta tags', (hooks) => {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFastbootService(this.owner);
    mockAdsService(this.owner);
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
