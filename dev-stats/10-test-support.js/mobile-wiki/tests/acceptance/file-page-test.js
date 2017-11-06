define('mobile-wiki/tests/acceptance/file-page-test', ['qunit', 'mobile-wiki/tests/helpers/module-for-acceptance', 'sinon'], function (_qunit, _moduleForAcceptance, _sinon) {
	'use strict';

	(0, _moduleForAcceptance.default)('Acceptance | file page');

	(0, _qunit.test)('visiting File Page', function (assert) {
		var originalImage = window.Image;

		window.Image = _sinon.default.stub();
		mockAdsService();
		mockFastbootService();

		visit('/');
		visit('/wiki/File:Example.jpg');

		andThen(function () {
			assert.equal(currentURL(), '/wiki/File:Example.jpg');

			assert.ok(find('.article-media-thumbnail img').length, 'Hero image is visible');
			assert.ok(find('.file-usage__header').length, 'Appears on header is visible');
			assert.ok(find('.file-usage__more a').length, 'Appears on see more link is visible');
			assert.equal(find('.file-usage__more a').attr('href'), '/wiki/Special:WhatLinksHere/File:Example.jpg');
			assert.equal(find('.file-usage__list .wikia-card').length, 1, 'Appears on had right number of items');

			window.Image = originalImage;
		});
	});
});