import { currentURL, visit, find, findAll } from '@ember/test-helpers';
import {test} from 'qunit';
import moduleForAcceptance from 'mobile-wiki/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | file page');

test('visiting File Page', async assert => {
    const originalImage = window.Image;

    window.Image = sinon.stub();
    mockAdsService();
    mockFastbootService();

    await visit('/');
    await visit('/wiki/File:Example.jpg');

    assert.equal(currentURL(), '/wiki/File:Example.jpg');

    assert.ok(find('.article-media-thumbnail img'), 'Hero image is visible');
    assert.ok(find('.file-usage__header'), 'Appears on header is visible');
    assert.ok(find('.file-usage__more a'), 'Appears on see more link is visible');
    assert.equal(find('.file-usage__more a').getAttribute('href'), '/wiki/Special:WhatLinksHere/File:Example.jpg');
    assert.equal(findAll('.file-usage__list .wikia-card').length, 1, 'Appears on had right number of items');

    window.Image = originalImage;
});
