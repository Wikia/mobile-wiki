import {test} from 'qunit';
import moduleForAcceptance from 'mobile-wiki/tests/helpers/module-for-acceptance';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | file page');

test('visiting File Page', (assert) => {
	const originalImage = window.Image;

	window.Image = sinon.stub();
	mockAdsService();

	visit('/');
	visit('/wiki/File:Example.jpg');

	andThen(() => {
		assert.equal(currentURL(), '/wiki/File:Example.jpg');

		assert.ok(find('.article-media-thumbnail img').length, 'Hero image is visible');
		assert.ok(find('.file-usage__header').length, 'Appears on header is visible');
		assert.ok(find('.file-usage__more a').length, 'Appears on see more link is visible');
		assert.equal(find('.file-usage__more a').attr('href'), '/wiki/Special:WhatLinksHere/File:Example.jpg');
		assert.equal(find('.file-usage__list .wikia-card').length, 1, 'Appears on had right number of items');

		window.Image = originalImage;
	});
});
