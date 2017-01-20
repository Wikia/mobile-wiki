import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | file page');

test('visiting File Page', (assert) => {
	const originalImage = window.Image;

	window.Image = sinon.stub();
	mockAdsService();

	visit('/');
	visit('/wiki/File:Example.jpg');

	andThen(() => {
		assert.equal(currentURL(), '/wiki/File:Example.jpg');

		assert.ok(find('.article-media-thumbnail img').is(':visible'), 'Hero image is visible');
		assert.ok(
			find('.article-media-thumbnail img').attr('src').indexOf('Kermit.jpg') > -1,
			'Hero image src contains "Kermit.jpg"'
		);

		assert.ok(find('.file-usage__header').is(':visible'), 'Appears on header is visible');
		assert.ok(find('.file-usage__more a').is(':visible'), 'Appears on see more link is visible');
		assert.equal(find('.file-usage__more a').attr('href'), '/wiki/Special:WhatLinksHere/File:Example.jpg');

		assert.equal(find('.file-usage__list .wikia-card').length, 1, 'Appears on had right number of items');

		window.Image = originalImage;
	});
});
