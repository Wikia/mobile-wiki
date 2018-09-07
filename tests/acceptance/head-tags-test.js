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

    assert.dom('meta[name="twitter:card"]').hasAttribute('content', 'summary');
    assert.dom('meta[name="twitter:site"]').hasAttribute('content', '@getfandom');
    assert.dom('meta[name="twitter:url"]').hasAttribute('content', 'http://fallout.wikia.com/wiki/File:Example.jpg');
    assert.dom('meta[name="twitter:title"]').hasAttribute('content', 'Image - Example.jpg | Fallout Wiki | FANDOM');
    assert.dom('meta[name="twitter:description"]').hasAttribute('content', 'Licensing This file was taken from the video game Fallout: New Vegas or from websites created...');
  });
});
